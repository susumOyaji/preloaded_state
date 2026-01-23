// preloaded_state/src/libnode/analysis.rs

use crate::libnode::models;
use chrono::NaiveDate;

// Placeholder function for buy signal analysis
pub fn analyze_stock_for_buy(
    stock: &models::Stock,
    prices: &[models::DailyPrice],
) -> Option<models::SignalInput> {
    if prices.len() < 2 {
        return None; // Need at least two days of data for comparison
    }

    let latest_price = &prices[0];
    let prev_price = &prices[1];

    // Simple logic: If current close is 5% lower than previous close, it's a potential buy.
    if latest_price.close < prev_price.close * 0.95 {
        return Some(models::SignalInput {
            code: stock.code.clone(),
            signal_type: "BUY".to_string(),
            reason: "Price dropped significantly (5%)".to_string(),
            date: latest_price.date,
            price_at_signal: latest_price.close,
        });
    }

    None
}

// Placeholder function for sell signal analysis
pub fn analyze_stock_for_sell(
    stock: &models::Stock,
    prices: &[models::DailyPrice],
    purchase_price: f64,
) -> Option<models::SignalInput> {
    if prices.is_empty() {
        return None;
    }

    let latest_price = &prices[0];

    // Simple logic: If current price is 10% higher than purchase price, sell for profit.
    if latest_price.close > purchase_price * 1.10 {
        return Some(models::SignalInput {
            code: stock.code.clone(),
            signal_type: "SELL".to_string(),
            reason: "Reached 10% profit margin".to_string(),
            date: latest_price.date,
            price_at_signal: latest_price.close,
        });
    }

    // Simple logic: If current price is 5% lower than purchase price, sell to cut loss.
    if latest_price.close < purchase_price * 0.95 {
        return Some(models::SignalInput {
            code: stock.code.clone(),
            signal_type: "SELL".to_string(),
            reason: "Reached 5% loss margin".to_string(),
            date: latest_price.date,
            price_at_signal: latest_price.close,
        });
    }

    None
}
