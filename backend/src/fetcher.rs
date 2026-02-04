// preloaded_state/src/libnode/fetcher.rs

use worker::*;
use crate::models;
use serde_json::Value;
use chrono::{NaiveDate};

pub async fn fetch_stock_info(code: &str) -> Result<models::StockInfo> {
    let url = format!("https://query1.finance.yahoo.com/v1/finance/search?q={}", code);
    
    let headers = Headers::new();
    headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")?;
    headers.set("Accept", "application/json, text/plain, */*")?;
    headers.set("Accept-Language", "ja,en-US;q=0.9,en;q=0.8")?;

    let req = Request::new_with_init(
        &url,
        &RequestInit {
            headers,
            ..RequestInit::default()
        },
    )?;

    let mut resp = Fetch::Request(req).send().await?;
    let json_response: Value = resp.json().await?;

    if let Some(quotes) = json_response["quotes"].as_array() {
        if let Some(first_quote) = quotes.get(0) {
            let symbol = first_quote["symbol"].as_str().unwrap_or(code).to_string();
            let name = first_quote["shortname"].as_str().unwrap_or("Unknown").to_string();
            let market = first_quote["exchDisp"].as_str().map(|s| s.to_string());

            return Ok(models::StockInfo { code: symbol, name, market });
        }
    }
    Err(Error::RustError(format!("Could not find stock info for code: {}", code)))
}

pub async fn fetch_stock_data(code: &str, period_days: u32) -> Result<Vec<models::DailyPrice>> {
    console_log!("fetch_stock_data (JSON v8) with User-Agent for code: {}", code);
    
    let range = format!("{}d", period_days + 10);
    let url_str = format!(
        "https://query1.finance.yahoo.com/v8/finance/chart/{}?interval=1d&range={}",
        code, range
    );

    let headers = Headers::new();
    headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")?;
    headers.set("Accept", "application/json, text/plain, */*")?;
    headers.set("Accept-Language", "ja,en-US;q=0.9,en;q=0.8")?;

    let req = Request::new_with_init(
        &url_str,
        &RequestInit {
            headers,
            ..RequestInit::default()
        },
    )?;

    let mut resp = Fetch::Request(req).send().await?;

    if resp.status_code() != 200 {
        let err_text = resp.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        console_log!("[{}] API Error {}: {}", code, resp.status_code(), err_text);
        return Err(Error::RustError(format!("Yahoo API returned status {}", resp.status_code())));
    }

    let json: Value = resp.json().await?;
    let mut daily_prices = Vec::new();

    if let Some(result) = json["chart"]["result"].as_array().and_then(|a| a.get(0)) {
        if let (Some(timestamps), Some(indicators)) = (result["timestamp"].as_array(), result["indicators"]["quote"].as_array().and_then(|a| a.get(0))) {
            
            let opens = indicators["open"].as_array();
            let highs = indicators["high"].as_array();
            let lows = indicators["low"].as_array();
            let closes = indicators["close"].as_array();
            let volumes = indicators["volume"].as_array();

            for i in 0..timestamps.len() {
                let ts = timestamps[i].as_i64().unwrap_or(0);
                let date = chrono::DateTime::from_timestamp(ts, 0)
                    .map(|dt| dt.naive_utc().date())
                    .unwrap_or_else(|| NaiveDate::from_ymd_opt(2000, 1, 1).unwrap());

                let close = closes.and_then(|a| a.get(i)).and_then(|v| v.as_f64());
                if close.is_none() { continue; }

                daily_prices.push(models::DailyPrice {
                    code: code.to_string(),
                    date,
                    open: opens.and_then(|a| a.get(i)).and_then(|v| v.as_f64()).unwrap_or(0.0),
                    high: highs.and_then(|a| a.get(i)).and_then(|v| v.as_f64()).unwrap_or(0.0),
                    low: lows.and_then(|a| a.get(i)).and_then(|v| v.as_f64()).unwrap_or(0.0),
                    close: close.unwrap(),
                    volume: volumes.and_then(|a| a.get(i)).and_then(|v| v.as_f64()).unwrap_or(0.0) as i64,
                });
            }
        }
    }

    daily_prices.reverse();
    console_log!("[{}] Parsed {} records from JSON.", code, daily_prices.len());

    Ok(daily_prices)
}
