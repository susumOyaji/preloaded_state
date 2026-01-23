// preloaded_state/src/libnode/fetcher.rs

use worker::*;
use async_trait::async_trait;
use crate::libnode::models;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use chrono::{NaiveDate, Utc, Duration}; // Add Duration

// Function to fetch stock info (name) for a given code
pub async fn fetch_stock_info(code: &str) -> Result<models::StockInfo> {
    // This is a placeholder URL and parsing logic.
    // Real Yahoo Finance API for stock info might be more complex or require specific endpoints.
    // Example: https://query1.finance.yahoo.com/v1/finance/search?q={code}
    let url = format!("https://query1.finance.yahoo.com/v1/finance/search?q={}", code);
    
    let response = Fetch::Url(url.parse().unwrap())
        .send()
        .await?
        .text()
        .await?;

    let json_response: Value = serde_json::from_str(&response)
        .map_err(|e| Error::RustError(format!("Failed to parse stock info JSON: {}", e)))?;

    // Assuming the response has a structure like { "quotes": [{ "symbol": "...", "shortname": "..." }] }
    if let Some(quotes) = json_response["quotes"].as_array() {
        if let Some(first_quote) = quotes.get(0) {
            let symbol = first_quote["symbol"].as_str().unwrap_or(code).to_string();
            let name = first_quote["shortname"].as_str().unwrap_or("Unknown").to_string();
            let market = first_quote["exchDisp"].as_str().map(|s| s.to_string()); // Exchange display name

            return Ok(models::StockInfo { code: symbol, name, market });
        }
    }

    Err(Error::RustError(format!("Could not find stock info for code: {}", code)))
}

// Function to fetch historical daily price data
pub async fn fetch_stock_data(code: &str, period_days: u32) -> Result<Vec<models::DailyPrice>> {
    let now = Utc::now();
    let end_timestamp = now.timestamp();
    let start_timestamp = (now - Duration::days(period_days as i64)).timestamp();

    // Example Yahoo Finance historical data API URL (requires interval and crumb/cookie for extended access)
    // This is a simplified URL; actual usage with yahoo-finance2 is more involved with cookies/crumbs.
    // For a public API, a different, possibly simpler endpoint might be used or direct scraping might be needed.
    // For now, let's assume a direct API call structure for simplicity.
    // Note: The 'crumb' parameter is crucial for Yahoo Finance. A static 'random' string is a placeholder.
    // In a real scenario, this would need to be dynamically fetched, which adds significant complexity.
    let url = format!(
        "https://query1.finance.yahoo.com/v7/finance/download/{}?period1={}&period2={}&interval=1d&events=history&crumb=random",
        code,
        start_timestamp,
        end_timestamp
    );

    let response = Fetch::Url(url.parse().unwrap())
        .send()
        .await?
        .text()
        .await?;

    // Yahoo Finance download API typically returns CSV. Let's parse CSV.
    let mut reader = csv::ReaderBuilder::new()
        .has_headers(true)
        .delimiter(b',')
        .from_reader(response.as_bytes());

    let mut daily_prices = Vec::new();

    for result in reader.deserialize() {
        let record: CsvDailyPrice = result
            .map_err(|e| Error::RustError(format!("Failed to deserialize CSV record: {}", e)))?;
        
        // Convert to our DailyPrice model, handle potential parsing errors
        let date = NaiveDate::parse_from_str(&record.Date, "%Y-%m-%d")
            .map_err(|e| Error::RustError(format!("Failed to parse date: {}", e)))?;

        // Filter out records where Close price is 0.0, as Yahoo Finance sometimes has these for non-trading days
        if record.Close == 0.0 {
            continue;
        }

        daily_prices.push(models::DailyPrice {
            code: code.to_string(), // Use the requested code
            date,
            open: record.Open,
            high: record.High,
            low: record.Low,
            close: record.Close,
            volume: record.Volume,
        });
    }

    Ok(daily_prices)
}

// Helper struct for CSV deserialization
#[derive(Debug, Deserialize)]
struct CsvDailyPrice {
    Date: String,
    Open: f64,
    High: f64,
    Low: f64,
    Close: f64,
    #[serde(rename = "Adj Close")]
    Adj_Close: f64, // Not used in our model, but present in CSV
    Volume: i64,
}
