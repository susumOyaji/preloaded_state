// preloaded_state/src/libnode/models.rs

use serde::{Deserialize, Serialize};
use chrono::{NaiveDate};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Stock {
    pub code: String,
    pub name: String,
    pub market: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct StockInput {
    pub code: String,
    pub name: String,
    pub market: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PortfolioItem {
    pub id: i32,
    pub code: String,
    pub shares: i32,
    pub purchase_price: f64,
    pub purchase_date: NaiveDate,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PortfolioItemInput {
    pub code: String,
    pub shares: i32,
    pub purchase_price: f64,
    pub purchase_date: Option<NaiveDate>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct DailyPrice {
    pub code: String,
    pub date: NaiveDate,
    pub open: f64,
    pub high: f64,
    pub low: f64,
    pub close: f64,
    pub volume: i64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Signal {
    pub id: i32, // Primary key
    pub code: String,
    #[serde(rename = "signalType")]
    pub signal_type: String, // e.g., "BUY", "SELL"
    pub reason: String,
    pub date: NaiveDate,
    #[serde(rename = "priceAtSignal")]
    pub price_at_signal: f64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SignalInput {
    pub code: String,
    #[serde(rename = "signalType")]
    pub signal_type: String,
    pub reason: String,
    pub date: NaiveDate,
    #[serde(rename = "priceAtSignal")]
    pub price_at_signal: f64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct StockInfo {
    pub code: String,
    pub name: String,
    pub market: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FrontendStock {
    pub code: String,
    pub broker: Option<String>,
    pub quantity: i32,
    #[serde(rename = "avgPrice")]
    pub avg_price: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateRequest {
    pub stocks: Vec<FrontendStock>,
}
