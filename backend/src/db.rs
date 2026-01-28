// preloaded_state/src/libnode/db.rs

use worker::*;
use crate::models;
use wasm_bindgen::JsValue;

pub async fn initialize_db(d1: &D1Database) -> Result<()> {
    // Create stocks table
    d1.prepare("
        CREATE TABLE IF NOT EXISTS stocks (
            code TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            market TEXT
        );
    ").run().await?;

    // Create daily_prices table
    d1.prepare("
        CREATE TABLE IF NOT EXISTS daily_prices (
            code TEXT NOT NULL,
            date TEXT NOT NULL,
            open REAL,
            high REAL,
            low REAL,
            close REAL,
            volume INTEGER,
            PRIMARY KEY (code, date)
        );
    ").run().await?;

    // Create portfolio_items table
    d1.prepare("
        CREATE TABLE IF NOT EXISTS portfolio_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL,
            shares INTEGER NOT NULL,
            purchase_price REAL NOT NULL,
            purchase_date TEXT NOT NULL
        );
    ").run().await?;

    // Create signals table
    d1.prepare("
        CREATE TABLE IF NOT EXISTS signals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL,
            signal_type TEXT NOT NULL,
            reason TEXT NOT NULL,
            date TEXT NOT NULL,
            price_at_signal REAL NOT NULL
        );
    ").run().await?;

    // Add unique index to prevent duplicate signals
    d1.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_signals_unique ON signals(code, signal_type, date, reason);").run().await?;

    Ok(())
}

pub async fn get_all_stocks(d1: &D1Database) -> Result<Vec<models::Stock>> {
    let statement = d1.prepare("SELECT code, name, market FROM stocks");
    let results = statement.all().await?.results::<models::Stock>()?;
    Ok(results)
}

pub async fn add_stock(d1: &D1Database, stock: models::StockInput) -> Result<()> {
    d1.prepare("INSERT OR REPLACE INTO stocks (code, name, market) VALUES (?, ?, ?)")
        .bind(&[
            stock.code.into(),
            stock.name.into(),
            stock.market.map_or(JsValue::NULL, |m| m.into()),
        ])?
        .run()
        .await?;
    Ok(())
}

pub async fn delete_stock(d1: &D1Database, code: &str) -> Result<()> {
    d1.prepare("DELETE FROM stocks WHERE code = ?")
        .bind(&[code.into()])?
        .run()
        .await?;
    Ok(())
}

pub async fn get_all_signals(d1: &D1Database) -> Result<Vec<models::Signal>> {
    let statement = d1.prepare("SELECT id, code, signal_type AS signalType, reason, date, price_at_signal AS priceAtSignal FROM signals");
    let results = statement.all().await?.results::<models::Signal>()?;
    Ok(results)
}

pub async fn delete_all_signals(d1: &D1Database) -> Result<()> {
    d1.prepare("DELETE FROM signals").run().await?;
    Ok(())
}

pub async fn save_signal(d1: &D1Database, signal: models::SignalInput) -> Result<()> {
    d1.prepare("INSERT OR IGNORE INTO signals (code, signal_type, reason, date, price_at_signal) VALUES (?, ?, ?, ?, ?)")
        .bind(&[
            signal.code.into(),
            signal.signal_type.into(),
            signal.reason.into(),
            signal.date.to_string().into(), // Convert NaiveDate to string for DB
            signal.price_at_signal.into(),
        ])?
        .run()
        .await?;
    Ok(())
}

pub async fn get_portfolio(d1: &D1Database) -> Result<Vec<models::PortfolioItem>> {
    let statement = d1.prepare("SELECT id, code, shares, purchase_price, purchase_date FROM portfolio_items");
    let results = statement.all().await?.results::<models::PortfolioItem>()?;
    Ok(results)
}

pub async fn add_to_portfolio(d1: &D1Database, item: models::PortfolioItemInput) -> Result<()> {
    let purchase_date_str = item.purchase_date.map_or(
        chrono::Utc::now().date_naive().to_string(), // Default to today if None
        |d| d.to_string()
    );

    d1.prepare("INSERT INTO portfolio_items (code, shares, purchase_price, purchase_date) VALUES (?, ?, ?, ?)")
        .bind(&[
            item.code.into(),
            item.shares.into(),
            item.purchase_price.into(),
            purchase_date_str.into(),
        ])?
        .run()
        .await?;
    Ok(())
}

pub async fn remove_from_portfolio(d1: &D1Database, id: i32) -> Result<()> {
    d1.prepare("DELETE FROM portfolio_items WHERE id = ?")
        .bind(&[id.into()])?
        .run()
        .await?;
    Ok(())
}

pub async fn upsert_daily_price(d1: &D1Database, price: models::DailyPrice) -> Result<()> {
    d1.prepare("INSERT OR REPLACE INTO daily_prices (code, date, open, high, low, close, volume) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(&[
            price.code.into(),
            price.date.to_string().into(),
            price.open.into(),
            price.high.into(),
            price.low.into(),
            price.close.into(),
            (price.volume as f64).into(),
        ])?
        .run()
        .await?;
    Ok(())
}

pub async fn get_daily_prices(d1: &D1Database, code: &str, limit: u32) -> Result<Vec<models::DailyPrice>> {
    let statement = d1.prepare("SELECT code, date, open, high, low, close, volume FROM daily_prices WHERE code = ? ORDER BY date DESC LIMIT ?");
    let results = statement.bind(&[code.into(), limit.into()])?.all().await?.results::<models::DailyPrice>()?;
    Ok(results)
}

pub async fn get_latest_price(d1: &D1Database, code: &str) -> Result<Option<models::DailyPrice>> {
    let statement = d1.prepare("SELECT code, date, open, high, low, close, volume FROM daily_prices WHERE code = ? ORDER BY date DESC LIMIT 1");
    let results = statement.bind(&[code.into()])?.all().await?.results::<models::DailyPrice>()?;
    Ok(results.into_iter().next())
}
