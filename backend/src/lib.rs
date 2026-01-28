// preloaded_state/src/lib.rs

use futures::future::join_all;

use lazy_static::lazy_static;

use regex::Regex;

use scraper::{Html, Selector};

use serde::Serialize;

use serde_json::{Map, Value};

use worker::*;

// Declare sub-modules
pub mod analysis;
pub mod db;
pub mod fetcher;
pub mod models;

// Helper function for logging requests from libnode.rs

fn log_request(req: &Request) {
    let url = match req.url() {
        Ok(u) => u,
        Err(_) => return,
    };
    let method = req.method().to_string();
    let host = url.host_str().unwrap_or("localhost");
    let path = url.path();
    let query = url.query().unwrap_or("");

    console_log!("{} - [{}] {} {}", method, host, path, query);
}



// Handler for GET /api/stocks - 銘柄一覧取得

async fn handle_get_stocks(_req: Request, ctx: RouteContext<()>) -> Result<Response> {

    let d1 = ctx.d1("DB")?;

    let stocks = db::get_all_stocks(&d1).await?;

    Response::from_json(&stocks)

}



// Handler for GET /api/signals - シグナル一覧取得

async fn handle_get_signals(_req: Request, ctx: RouteContext<()>) -> Result<Response> {

    let d1 = ctx.d1("DB")?;

    let signals = db::get_all_signals(&d1).await?;

    Response::from_json(&signals)

}



// Handler for GET /api/stocks/info/:code - 銘柄情報取得 (名前の自動取得用)

async fn handle_get_stock_info(_req: Request, ctx: RouteContext<()>) -> Result<Response> {

    let code = ctx.param("code").unwrap().clone();

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

    Response::from_json(&serde_json::json!({ "success": true }))

}



// Handler for DELETE /api/stocks/:code - 銘柄削除

async fn handle_delete_stocks(_req: Request, ctx: RouteContext<()>) -> Result<Response> {

    let d1 = ctx.d1("DB")?;

    let code = ctx.param("code").unwrap().clone();

    db::delete_stock(&d1, &code).await?;

    Response::from_json(&serde_json::json!({ "success": true }))

}



// Handler for GET /api/portfolio - ポートフォリオ取得

async fn handle_get_portfolio(_req: Request, ctx: RouteContext<()>) -> Result<Response> {

    let d1 = ctx.d1("DB")?;

    let portfolio = db::get_portfolio(&d1).await?;

    Response::from_json(&portfolio)

}



// Handler for POST /api/portfolio - ポートフォリオ追加 (株を買う)

async fn handle_post_portfolio(mut req: Request, ctx: RouteContext<()>) -> Result<Response> {

    let d1 = ctx.d1("DB")?;

    let portfolio_item_input: models::PortfolioItemInput = req.json().await?;

    db::add_to_portfolio(&d1, portfolio_item_input).await?;

    Response::from_json(&serde_json::json!({ "success": true }))

}



// Handler for DELETE /api/portfolio/:id - ポートフォリオから削除 (株を売る)

async fn handle_delete_portfolio(_req: Request, ctx: RouteContext<()>) -> Result<Response> {

    let d1 = ctx.d1("DB")?;

    let id_str = ctx.param("id").unwrap().clone();

    let id = id_str

        .parse::<i32>()

        .map_err(|e| Error::RustError(format!("Invalid ID: {}", e)))?;

    db::remove_from_portfolio(&d1, id).await?;

    Response::from_json(&serde_json::json!({ "success": true }))

}

// Handler for POST /api/update - データ更新 + シグナル分析
async fn handle_post_update(mut req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let d1 = ctx.d1("DB")?;
    let mut logs: Vec<String> = Vec::new();

    // Catch JSON parse error if body is empty or malformed
    let update_req: models::UpdateRequest = match req.json().await {
        Ok(res) => res,
        Err(e) => return Response::error(format!("Invalid JSON: {}", e), 400),
    };

    logs.push(format!(
        "Starting update for {} stocks from localStorage...",
        update_req.stocks.len()
    ));

    let mut new_signals_count = 0;
    
    // Get unique codes to avoid redundant fetches
    let mut unique_codes: std::collections::HashSet<String> = std::collections::HashSet::new();
    for s in &update_req.stocks {
        unique_codes.insert(s.code.clone());
    }

    for code in unique_codes {
        console_log!("--- Processing unique code: {} ---", code);
        match fetcher::fetch_stock_data(&code, 150).await {
            Ok(prices) => {
                console_log!("[{}] Fetched {} price records.", code, prices.len());
                if !prices.is_empty() {
                    // Update DB with latest prices (Cache)
                    for price in &prices {
                        db::upsert_daily_price(&d1, price.clone()).await?;
                    }
                    logs.push(format!("[{}]. Data updated ({} records).", code, prices.len()));

                    let stock_model = models::Stock {
                        code: code.clone(),
                        name: code.clone(),
                        market: None,
                    };

                    // Check if user owns this stock in ANY broker
                    let owned_entries: Vec<&models::FrontendStock> = update_req.stocks.iter()
                        .filter(|s| s.code == code && s.quantity > 0)
                        .collect();
                    
                    if owned_entries.is_empty() {
                        // 1. BUY Analysis (Only for stocks not yet owned)
                        if let Some(buy_signal) = analysis::analyze_stock_for_buy(&stock_model, &prices) {
                            db::save_signal(&d1, buy_signal).await?;
                            new_signals_count += 1;
                            console_log!("[{}] BUY SIGNAL DETECTED!", code);
                            logs.push(format!("[{}] BUY SIGNAL DETECTED!", code));
                        }
                    } else {
                        // 2. SELL Analysis (Only for owned stocks)
                        // Use the lowest avg_price among entries for conservative stop-loss/profit-taking
                        let min_avg_price = owned_entries.iter()
                            .map(|s| s.avg_price)
                            .fold(f64::INFINITY, f64::min);

                        if let Some(sell_signal) = analysis::analyze_stock_for_sell(
                            &stock_model,
                            &prices,
                            min_avg_price,
                        ) {
                            db::save_signal(&d1, sell_signal.clone()).await?;
                            new_signals_count += 1;
                            console_log!("[{}] SELL SIGNAL DETECTED! Reason: {}", code, sell_signal.reason);
                            logs.push(format!(
                                "[{}]. SELL SIGNAL DETECTED! ({})",
                                code, sell_signal.reason
                            ));
                        }
                    }
                } else {
                    console_log!("[{}] No data retrieved.", code);
                    logs.push(format!("[{}] No data retrieved.", code));
                }
            }
            Err(e) => {
                console_log!("[{}] Fetch Error: {}", code, e);
                logs.push(format!("[{}] Error: {}", code, e));
            }
        }
    }

    logs.push(format!(
        "Update Complete. New signals: {}",
        new_signals_count
    ));
    Response::from_json(&serde_json::json!({
        "success": true,
        "logs": logs
    }))
}

// --- Start of content from original lib.rs ---

// Set up a panic hook to log errors to the console
fn set_panic_hook() {
    console_error_panic_hook::set_once();
}

const PREV_CLOSE_SEL_STR: &str = "section[class*='StocksEtfReitDataList'] ul li:first-child dd span[class*='StyledNumber__value']";
const NAME_SEL_STR: &str = "h1";
const PRICE_SEL_STR: &str =
    "div[class*='_CommonPriceBoard__priceBlock'] span[class*='_StyledNumber__value']";
const CHANGE_SEL_STR: &str =
    "span[class*='_PriceChangeLabel__primary'] span[class*='_StyledNumber__value']";
const CHANGE_RATE_SEL_STR: &str =
    "span[class*='_PriceChangeLabel__secondary'] span[class*='_StyledNumber__value']";
const TIME_SEL_STR_1: &str = "li[class*='_CommonPriceBoard__time'] time";
const TIME_SEL_STR_2: &str = "span[class*='_Time']";

lazy_static! {
    static ref PRELOADED_STATE_REGEX: Regex = 
        Regex::new(r"(?s)window\.__PRELOADED_STATE__\s*=\s*(.*?)</script>")
            .expect("Failed to compile regex");
    static ref PREV_CLOSE_SELECTOR: Selector = 
        Selector::parse(PREV_CLOSE_SEL_STR).expect("Failed to compile selector");
    static ref NAME_SELECTOR: Selector = 
        Selector::parse(NAME_SEL_STR).expect("Failed to compile selector");
    static ref PRICE_SELECTOR: Selector = 
        Selector::parse(PRICE_SEL_STR).expect("Failed to compile selector");
    static ref CHANGE_SELECTOR: Selector = 
        Selector::parse(CHANGE_SEL_STR).expect("Failed to compile selector");
    static ref CHANGE_RATE_SELECTOR: Selector = 
        Selector::parse(CHANGE_RATE_SEL_STR).expect("Failed to compile selector");
    static ref TIME_SELECTOR_1: Selector = 
        Selector::parse(TIME_SEL_STR_1).expect("Failed to compile selector");
    static ref TIME_SELECTOR_2: Selector = 
        Selector::parse(TIME_SEL_STR_2).expect("Failed to compile selector");
}

struct DataSource {
    path: &'static [&'static str],
    mappings: std::collections::HashMap<&'static str, &'static str>,
    strip_suffix: bool,
}

#[derive(Serialize, Debug)]
struct CodeResult {
    code: String,
    data: Option<Map<String, Value>>,
    error: Option<String>,
}

async fn handle_scrape(req: Request, _ctx: RouteContext<()>) -> Result<Response> {
    let url = req.url()?;
    let query_params: std::collections::HashMap<String, String> = 
        url.query_pairs().into_owned().collect();

    if !query_params.contains_key("code") {
        return Response::error("Query parameter 'code' is required for scraping.", 400);
    }

    let codes_str = query_params.get("code").unwrap();
    let codes: Vec<String> = codes_str
        .split(',')
        .filter(|s| !s.is_empty())
        .map(|s| s.trim().to_string())
        .take(20)
        .collect();

    if codes.is_empty() {
        return Response::error("Query parameter 'code' cannot be empty.", 400);
    }

    let keys: Option<Vec<String>> = query_params
        .get("keys")
        .map(|s| s.split(',').map(|k| k.trim().to_string()).collect());

    let futures = codes
        .iter()
        .map(|code| fetch_single_code(code.clone(), keys.clone()));
    let results = join_all(futures).await;

    Response::from_json(&results)
}


async fn fetch_single_code(code: String, keys: Option<Vec<String>>) -> CodeResult {
    if code.len() > 20 || code.contains('/') || code.contains('\\') {
        return CodeResult {
            code,
            data: None,
            error: Some("Invalid code format".to_string()),
        };
    }

    let url_str = if code.starts_with('^')
        || code.contains('=')
        || code.ends_with(".T")
        || code.ends_with(".O")
    {
        format!("https://finance.yahoo.co.jp/quote/{}/", code)
    } else {
        format!("https://finance.yahoo.co.jp/quote/{}.T/", code)
    };

    let url = match url_str.parse() {
        Ok(u) => u,
        Err(e) => {
            return CodeResult {
                code,
                data: None,
                error: Some(format!("Invalid URL: {}", e)),
            }
        }
    };

    let body = match Fetch::Url(url).send().await {
        Ok(mut resp) => match resp.text().await {
            Ok(text) => text,
            Err(e) => {
                return CodeResult {
                    code,
                    data: None,
                    error: Some(format!("Failed to read response text: {}", e)),
                }
            }
        },
        Err(e) => {
            return CodeResult {
                code,
                data: None,
                error: Some(format!("Failed to fetch URL: {}", e)),
            }
        }
    };

    let result_data: Result<Map<String, Value>> = 
        if let Some(caps) = PRELOADED_STATE_REGEX.captures(&body) {
            if let Some(json_match) = caps.get(1) {
                let mut json_str = json_match.as_str().trim();
                if json_str.ends_with(';') {
                    json_str = &json_str[..json_str.len() - 1];
                }

                match serde_json::from_str(json_str) {
                    Ok(data) => process_json_data(&code, &data, &body, keys.as_ref()),
                    Err(e) => {
                        console_log!("JSON parse error for {}: {}", code, e);
                        process_dom_data(&code, &body, keys.as_ref())
                    }
                }
            } else {
                process_dom_data(&code, &body, keys.as_ref())
            }
        } else {
            process_dom_data(&code, &body, keys.as_ref())
        };

    match result_data {
        Ok(data) => CodeResult {
            code,
            data: Some(data),
            error: None,
        },
        Err(e) => CodeResult {
            code,
            data: None,
            error: Some(e.to_string()),
        },
    }
}

fn process_json_data(
    code: &str,
    data: &Value,
    body: &str,
    keys: Option<&Vec<String>>,
) -> Result<Map<String, Value>> {
    let data_sources = get_data_sources();
    for source in &data_sources {
        if let Some(value_at_path) = find_value_at_path(data, source.path) {
            let objects_to_search: Vec<&Map<String, Value>> = 
                if let Some(arr) = value_at_path.as_array() {
                    arr.iter().filter_map(|v| v.as_object()).collect()
                } else if let Some(obj) = value_at_path.as_object() {
                    vec![obj]
                } else {
                    vec![]
                };

            if let Some(json_code_key) = source.mappings.get("code") {
                for target_obj in objects_to_search {
                    if let Some(found_code) = get_string_value(target_obj, json_code_key) {
                        let code_to_compare = if source.strip_suffix {
                            code.split('.').next().unwrap_or(code)
                        } else {
                            code
                        };

                        if found_code.trim() == code_to_compare {
                            let mut results = Map::new();
                            if keys.is_some() {
                                results = target_obj.clone();
                                results
                                    .insert("code".to_string(), Value::String(code.to_string()));
                            } else {
                                let minimal_keys = vec![
                                    "code".to_string(),
                                    "name".to_string(),
                                    "price".to_string(),
                                    "price_change".to_string(),
                                    "price_change_rate".to_string(),
                                    "update_time".to_string(),
                                ];
                                for key in &minimal_keys {
                                    if let Some(json_key) = source.mappings.get(key.as_str()) {
                                        if let Some(value) = target_obj.get(*json_key) {
                                            let str_val = 
                                                value.to_string().trim_matches('"').to_string();
                                            results.insert(key.clone(), Value::String(str_val));
                                        }
                                    } else if key == "code" {
                                        results
                                            .insert("code".to_string(), Value::String(code.to_string()));
                                    }
                                }
                            }

                            if let Some(price_val) = results.get("price") {
                                if price_val.as_str() == Some("---") {
                                    if let Some(save_price) = target_obj.get("savePrice") {
                                        let str_val = save_price
                                            .to_string()
                                            .trim_matches('"')
                                            .to_string();
                                        results
                                            .insert("price".to_string(), Value::String(str_val));
                                    }
                                }
                            }

                            let price_change_missing = results
                                .get("price_change")
                                .is_none_or(|v| v.as_str() == Some("---"));
                            if price_change_missing {
                                if let Some(price_str) = 
                                    results.get("price").and_then(|v| v.as_str())
                                {
                                    if price_str != "---" {
                                        let current_price = price_str
                                            .replace(',', "")
                                            .parse::<f64>()
                                            .unwrap_or(0.0);
                                        let document = Html::parse_document(body);

                                        if let Some(prev_close_el) = 
                                            document.select(&PREV_CLOSE_SELECTOR).next()
                                        {
                                            let prev_close_str = prev_close_el
                                                .text()
                                                .collect::<String>()
                                                .trim()
                                                .to_string();
                                            let prev_close = prev_close_str
                                                .replace(',', "")
                                                .parse::<f64>()
                                                .unwrap_or(0.0);

                                            if prev_close > 0.0 {
                                                let change = current_price - prev_close;
                                                let change_rate = (change / prev_close) * 100.0;

                                                results.insert(
                                                    "price_change".to_string(),
                                                    Value::String(format!("{:.1}", change)),
                                                );
                                                results.insert(
                                                    "price_change_rate".to_string(),
                                                    Value::String(format!("{:.2}", change_rate)),
                                                );
                                            }
                                        }
                                    }
                                }
                            }

                            results.insert("status".to_string(), Value::String("OK".to_string()));
                            results
                                .insert("source".to_string(), Value::String("json_predefined".to_string()));
                            return Ok(results);
                        }
                    }
                }
            }
        }
    }

    let fallback_keys_to_find = vec!["code".to_string()];
    let mut found_paths = Vec::new();
    find_object_paths(
        data,
        &fallback_keys_to_find,
        &mut Vec::new(),
        &mut found_paths,
    );

    let fallback_mappings = std::collections::HashMap::from([
        ("name", "name"),
        ("price", "price"),
        ("price_change", "priceChange"),
        ("price_change_rate", "priceChangeRate"),
        ("update_time", "priceDateTime"),
    ]);

    for path in found_paths {
        let mut target_obj = data;
        for &key in &path {
            target_obj = &target_obj[key];
        }
        if let Some(obj_map) = target_obj.as_object() {
            if let Some(found_code) = get_string_value(obj_map, "code") {
                let code_to_compare = code.split('.').next().unwrap_or(code);
                if found_code.trim() == code_to_compare {
                    let mut results = Map::new();
                    if keys.is_some() {
                        results = obj_map.clone();
                        results.insert("code".to_string(), Value::String(code.to_string()));
                    } else {
                        let minimal_keys = vec![
                            "code".to_string(),
                            "name".to_string(),
                            "price".to_string(),
                            "price_change".to_string(),
                            "price_change_rate".to_string(),
                            "update_time".to_string(),
                        ];
                        for key in &minimal_keys {
                            if let Some(json_key) = fallback_mappings.get(key.as_str()) {
                                if let Some(value) = obj_map.get(*json_key) {
                                    let str_val = 
                                        value.to_string().trim_matches('"').to_string();
                                    results.insert(key.clone(), Value::String(str_val));
                                }
                            } else if key == "code" {
                                results
                                    .insert("code".to_string(), Value::String(code.to_string()));
                            }
                        }
                    }
                    results.insert("status".to_string(), Value::String("OK".to_string()));
                    results
                        .insert("source".to_string(), Value::String("json_fallback".to_string()));
                    return Ok(results);
                }
            }
        }
    }

    Err(worker::Error::from(
        "Could not find matching data in JSON.",
    ))
}

fn process_dom_data(
    code: &str,
    body: &str,
    keys: Option<&Vec<String>>,
) -> Result<Map<String, Value>> {
    let document = Html::parse_document(body);
    let mut results = Map::new();
    let mut selector_info = Map::new();

    let keys_to_process = if let Some(k) = keys {
        k.clone()
    } else {
        vec![
            "code".to_string(),
            "name".to_string(),
            "price".to_string(),
            "price_change".to_string(),
            "price_change_rate".to_string(),
            "update_time".to_string(),
        ]
    };

    for key in &keys_to_process {
        let (value, selector_used) = match key.as_str() {
            "code" => (Some(code.to_string()), None),
            "name" => (
                document
                    .select(&NAME_SELECTOR)
                    .next()
                    .map(|el| el.text().collect::<String>().trim().to_string()),
                Some(NAME_SEL_STR),
            ),
            "price" => (
                document
                    .select(&PRICE_SELECTOR)
                    .next()
                    .map(|el| el.text().collect::<String>().trim().to_string()),
                Some(PRICE_SEL_STR),
            ),
            "price_change" => (
                document
                    .select(&CHANGE_SELECTOR)
                    .next()
                    .map(|el| el.text().collect::<String>().trim().to_string()),
                Some(CHANGE_SEL_STR),
            ),
            "price_change_rate" => (
                document
                    .select(&CHANGE_RATE_SELECTOR)
                    .next()
                    .map(|el| el.text().collect::<String>().trim().to_string()),
                Some(CHANGE_RATE_SEL_STR),
            ),
            "update_time" => {
                let mut found = (None, None);
                let selectors: Vec<(&str, &Selector)> = if code == "^DJI" {
                    vec![(TIME_SEL_STR_2, &*TIME_SELECTOR_2), (TIME_SEL_STR_1, &*TIME_SELECTOR_1)]
                } else {
                    vec![(TIME_SEL_STR_1, &*TIME_SELECTOR_1), (TIME_SEL_STR_2, &*TIME_SELECTOR_2)]
                };

                for (sel_str, selector) in selectors {
                    if let Some(el) = document.select(selector).next() {
                        found = (
                            Some(el.text().collect::<String>().trim().to_string()),
                            Some(sel_str),
                        );
                        break;
                    }
                }
                found
            }
            _ => (None, None),
        };

        if let Some(val) = value {
            results.insert(key.clone(), Value::String(val));
        }
        if let Some(sel) = selector_used {
            selector_info.insert(key.clone(), Value::String(sel.to_string()));
        }
    }

    results.insert("selector_info".to_string(), Value::Object(selector_info));

    if keys_to_process.contains(&"name".to_string()) && !results.contains_key("name") {
        return Err(worker::Error::from(
            "Failed to scrape essential data (name) from DOM.",
        ));
    }
    if keys_to_process.contains(&"price".to_string()) && !results.contains_key("price") {
        return Err(worker::Error::from(
            "Failed to scrape essential data (price) from DOM.",
        ));
    }

    results.insert("status".to_string(), Value::String("OK".to_string()));
    results
        .insert("source".to_string(), Value::String("dom_fallback".to_string()));

    Ok(results)
}

fn get_data_sources() -> Vec<DataSource> {
    vec![
        DataSource {
            path: &["mainStocksPriceBoard", "priceBoard"],
            mappings: std::collections::HashMap::from([
                ("code", "code"),
                ("name", "name"),
                ("price", "price"),
                ("price_change", "priceChange"),
                ("price_change_rate", "priceChangeRate"),
                ("update_time", "priceDateTime"),
            ]),
            strip_suffix: true,
        },
        DataSource {
            path: &["mainCurrencyPriceBoard", "currencyPrices"],
            mappings: std::collections::HashMap::from([
                ("code", "currencyPairCode"),
                ("name", "currencyPairName"),
                ("price", "bid"),
                ("price_change", "priceChange"),
                ("price_change_rate", "priceChangeRate"),
                ("update_time", "priceUpdateTime"),
            ]),
            strip_suffix: false,
        },
        DataSource {
            path: &["mainDomesticIndexPriceBoard", "indexPrices"],
            mappings: std::collections::HashMap::from([
                ("code", "code"),
                ("name", "name"),
                ("price", "price"),
                ("price_change", "changePrice"),
                ("price_change_rate", "changePriceRate"),
                ("update_time", "japanUpdateTime"),
            ]),
            strip_suffix: false,
        },
    ]
}

fn find_value_at_path<'a>(value: &'a Value, path: &[&str]) -> Option<&'a Value> {
    let mut current = value;
    for key in path {
        current = current.get(key)?;
    }
    Some(current)
}

fn get_string_value<'a>(obj: &'a Map<String, Value>, key: &str) -> Option<&'a str> {
    obj.get(key)?.as_str()
}

fn find_object_paths<'a>(
    value: &'a Value,
    keys_to_find: &[String],
    current_path: &mut Vec<&'a str>,
    found_paths: &mut Vec<Vec<&'a str>>,
) {
    if let Value::Object(map) = value {
        if keys_to_find.iter().all(|key| map.contains_key(key)) {
            found_paths.push(current_path.clone());
        }
        for (key, nested_value) in map {
            current_path.push(key);
            find_object_paths(nested_value, keys_to_find, current_path, found_paths);
            current_path.pop();
        }
    } else if let Value::Array(arr) = value {
        for nested_value in arr {
            find_object_paths(nested_value, keys_to_find, current_path, found_paths);
        }
    }
}

// --- End of content from original lib.rs ---

// CORS response helper
fn cors_response(mut response: Response) -> Result<Response> {
    let headers = response.headers_mut();
    headers.set("Access-Control-Allow-Origin", "*")?;
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE")?;
    headers.set("Access-Control-Allow-Headers", "Content-Type")?;
    Ok(response)
}

async fn handle_delete_all_signals(_req: Request, ctx: RouteContext<()>) -> Result<Response> {
    let d1 = ctx.d1("DB")?;
    db::delete_all_signals(&d1).await?;
    Response::from_json(&serde_json::json!({ "success": true }))
}

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: Context) -> Result<Response> {
    set_panic_hook();
    log_request(&req);

    if req.method() == Method::Options {
        return cors_response(Response::empty()?);
    }
    
    let d1 = match env.d1("DB") {
        Ok(d) => d,
        Err(e) => {
            console_log!("Error: D1 binding 'DB' not found. Check wrangler.toml.");
            return Response::error(format!("D1 binding error: {}", e), 500);
        }
    };

    if let Err(e) = db::initialize_db(&d1).await {
        console_log!("Database initialization info: {}", e);
        // We continue because tables might already exist or be initialized via CLI
    }

    let router = Router::new();

    let res = router
        // --- libnode API routes ---
        .get_async("/api/stocks", handle_get_stocks)
        .delete_async("/api/signals", handle_delete_all_signals) // Added
        .get_async("/api/signals", handle_get_signals)
        .get_async("/api/stocks/info/:code", handle_get_stock_info)
        .post_async("/api/stocks", handle_post_stocks)
        .delete_async("/api/stocks/:code", handle_delete_stocks)
        .get_async("/api/portfolio", handle_get_portfolio)
        .post_async("/api/portfolio", handle_post_portfolio)
        .delete_async("/api/portfolio/:id", handle_delete_portfolio)
        .post_async("/api/update", handle_post_update)
        // --- Original lib.rs scraper route ---
        .get_async("/api/scrape", handle_scrape)
        .run(req, env)
        .await?;

    cors_response(res)
}