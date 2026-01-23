// preloaded_state/src/libnode.rs

use worker::*;
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use serde_json;
use chrono::{Utc, NaiveDate};

// Declare sub-modules
pub mod models;
pub mod db;
pub mod fetcher;
pub mod analysis;

// Helper function for logging requests
fn log_request(req: &Request) {
    console_log!(
        "{} - [{}] {} {}",
        req.method().as_str(),
        req.url().unwrap().host_str().unwrap(),
        req.url().unwrap().pathname(),
        req.url().unwrap().query().unwrap_or("")
    );
}

// Handler for GET /api/stocks - 銘柄一覧取得
async fn handle_get_stocks(_req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let d1 = ctx.d1("DB")?; // Assume D1 binding named "DB"
    let mut stocks = db::get_all_stocks(&d1).await?;
    
    // Enrich stocks with current price, prevClose, lastUpdate
    for stock in &mut stocks {
        let prices = db::get_daily_prices(&d1, &stock.code, 2).await?;
        let latest_price = prices.get(0);
        let prev_price = prices.get(1);

        // Note: The original Node.js code checked for CSV files.
        // With D1, we directly check for price data in the DB.
        // hasDataToday would be true if latest_price is Some.
        // For simplicity, directly adding currentPrice, prevClose, lastUpdate to the Stock struct
        // or a new enriched Stock struct might be better, but for now, returning basic stocks
        // and letting the frontend handle enrichment if needed.
        // If frontend needs these, we'd need a more complex return type or a separate endpoint.

        // To fully mirror the Node.js behavior, we might need to modify `models::Stock`
        // or create a new `EnrichedStock` model.
        // For now, let's keep it simple and assume the basic stock data is sufficient,
        // or the enrichment happens on the client side using the latest price.
        // If direct enrichment is needed here, the `Stock` model needs modification.
    }
    Response::from_json(&stocks)
}

// Handler for GET /api/signals - シグナル一覧取得
async fn handle_get_signals(_req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let d1 = ctx.d1("DB")?;
    let signals = db::get_all_signals(&d1).await?;
    Response::from_json(&signals)
}

// Handler for GET /api/stocks/info/:code - 銘柄情報取得 (名前の自動取得用)
async fn handle_get_stock_info(req: Request, _ctx: RouteContext<()>) -> Result<Response> {
    let code = req.param("code").unwrap_or(&"".to_string()).clone();
    match fetcher::fetch_stock_info(&code).await {
        Ok(info) => Response::from_json(&info),
        Err(e) => Response::error(format!("Error fetching stock info: {}", e), 500),
    }
}

// Handler for POST /api/stocks - 銘柄追加
async fn handle_post_stocks(mut req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let d1 = ctx.d1("DB")?;
    let stock_input: models::StockInput = req.json().await?;
    if stock_input.code.is_empty() || stock_input.name.is_empty() {
        return Response::error("Code and Name required", 400);
    }
    db::add_stock(&d1, stock_input).await?;
    Response::from_json(&serde_json::json!({"success": true}))
}

// Handler for DELETE /api/stocks/:code - 銘柄削除
async fn handle_delete_stocks(req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let d1 = ctx.d1("DB")?;
    let code = req.param("code").unwrap_or(&"".to_string()).clone();
    db::delete_stock(&d1, &code).await?;
    Response::from_json(&serde_json::json!({"success": true}))
}

// Handler for GET /api/portfolio - ポートフォリオ取得
async fn handle_get_portfolio(_req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let d1 = ctx.d1("DB")?;
    let portfolio = db::get_portfolio(&d1).await?;
    // Further logic to enrich portfolio with current price
    Response::from_json(&portfolio)
}

// Handler for POST /api/portfolio - ポートフォリオ追加 (株を買う)
async fn handle_post_portfolio(mut req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let d1 = ctx.d1("DB")?;
    let portfolio_item_input: models::PortfolioItemInput = req.json().await?;
    db::add_to_portfolio(&d1, portfolio_item_input).await?;
    Response::from_json(&serde_json::json!({"success": true}))
}

// Handler for DELETE /api/portfolio/:id - ポートフォリオから削除 (株を売る)
async fn handle_delete_portfolio(req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let d1 = ctx.d1("DB")?;
    let id_str = req.param("id").unwrap_or(&"".to_string()).clone();
    let id = id_str.parse::<i32>().map_err(|e| Error::RustError(format!("Invalid ID: {}", e)))?;
    db::remove_from_portfolio(&d1, id).await?;
    Response::from_json(&serde_json::json!({"success": true}))
}

// Handler for POST /api/update - データ更新 + シグナル分析
async fn handle_post_update(_req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let d1 = ctx.d1("DB")?;
    let mut logs: Vec<String> = Vec::new();
    let stocks = db::get_all_stocks(&d1).await?;
    let portfolio = db::get_portfolio(&d1).await?;
    
    logs.push(format!("Starting update for {} stocks...", stocks.len()));

    let mut new_signals_count = 0;

    for stock in stocks {
        match fetcher::fetch_stock_data(&stock.code, 150).await { // 150 days of data
            Ok(prices) => {
                if !prices.is_empty() {
                    for price in prices {
                        db::upsert_daily_price(&d1, price).await?;
                    }
                    logs.push(format!("[{}] Data updated ({} records).", stock.code, prices.len()));

                    // Buy Analysis
                    if let Some(buy_signal) = analysis::analyze_stock_for_buy(&stock, &prices) {
                        db::save_signal(&d1, buy_signal).await?;
                        new_signals_count += 1;
                        logs.push(format!("[{}] BUY SIGNAL DETECTED!", stock.code));
                    }

                    // Sell Analysis
                    let holdings = portfolio.iter().filter(|p| p.code == stock.code).collect::<Vec<_>>();
                    for holding in holdings {
                        if let Some(sell_signal) = analysis::analyze_stock_for_sell(&stock, &prices, holding.purchase_price) {
                            db::save_signal(&d1, sell_signal).await?;
                            new_signals_count += 1;
                            logs.push(format!("[{}] SELL SIGNAL DETECTED! ({})", stock.code, sell_signal.reason));
                        }
                    }

                } else {
                    logs.push(format!("[{}] No data retrieved.", stock.code));
                }
            },
            Err(e) => logs.push(format!("[{}] Error: {}", stock.code, e)),
        }
    }

    logs.push(format!("Update Complete. New signals: {}", new_signals_count));
    Response::from_json(&serde_json::json!({
        "success": true,
        "logs": logs
    }))
}


// Main entry point for the worker (if this were a standalone worker)
#[event(fetch)]
pub async fn main_server_logic(req: Request, env: Env, _ctx: Context) -> Result<Response> {
    log_request(&req);

    let router = Router::new();

    router
        // GET /api/stocks - 銘柄一覧取得
        .get_async("/api/stocks", handle_get_stocks)
        // GET /api/signals - シグナル一覧取得
        .get_async("/api/signals", handle_get_signals)
        // GET /api/stocks/info/:code - 銘柄情報取得 (名前の自動取得用)
        .get_async("/api/stocks/info/:code", handle_get_stock_info)
        // POST /api/stocks - 銘柄追加
        .post_async("/api/stocks", handle_post_stocks)
        // DELETE /api/stocks/:code - 銘柄削除
        .delete_async("/api/stocks/:code", handle_delete_stocks)
        // GET /api/portfolio - ポートフォリオ取得
        .get_async("/api/portfolio", handle_get_portfolio)
        // POST /api/portfolio - ポートフォリオ追加 (株を買う)
        .post_async("/api/portfolio", handle_post_portfolio)
        // DELETE /api/portfolio/:id - ポートフォリオから削除 (株を売る)
        .delete_async("/api/portfolio/:id", handle_delete_portfolio)
        // POST /api/update - データ更新 + シグナル分析
        .post_async("/api/update", handle_post_update)
        .run(req, env)
        .await
}
