// preloaded_state/src/libnode/analysis.rs

use crate::models;

/// Calculate the simple moving average for a given period
fn calculate_sma(prices: &[models::DailyPrice], period: usize) -> Option<f64> {
    if prices.len() < period {
        return None;
    }
    
    let sum: f64 = prices.iter().take(period).map(|p| p.close).sum();
    Some(sum / period as f64)
}

/// Calculate divergence rate (%) from moving average
fn calculate_divergence_rate(current_price: f64, sma: f64) -> f64 {
    ((current_price - sma) / sma) * 100.0
}

// Handler for buy signal analysis
pub fn analyze_stock_for_buy(
    stock: &models::Stock,
    prices: &[models::DailyPrice],
) -> Option<models::SignalInput> {
    if prices.len() < 30 { // Need at least 25+ days for SMA25 + buffer for cross detection
        return None;
    }

    let latest_price = &prices[0];
    let prev_price = &prices[1];

    // 1. Golden Cross Detection (SMA5 crosses SMA25 upward)
    if let (Some(curr_sma5), Some(curr_sma25), Some(prev_sma5), Some(prev_sma25)) = (
        calculate_sma(prices, 5),
        calculate_sma(prices, 25),
        calculate_sma(&prices[1..], 5),
        calculate_sma(&prices[1..], 25),
    ) {
        if curr_sma5 > curr_sma25 && prev_sma5 <= prev_sma25 {
            return Some(models::SignalInput {
                code: stock.code.clone(),
                signal_type: "BUY".to_string(),
                reason: "Golden Cross (SMA 5/25)".to_string(),
                date: latest_price.date,
                price_at_signal: latest_price.close,
            });
        }
    }

    // 2. 25-day Moving Average Divergence Logic (Oversold)
    if let Some(sma25) = calculate_sma(prices, 25) {
        let divergence = calculate_divergence_rate(latest_price.close, sma25);
        if divergence < -10.0 {
            return Some(models::SignalInput {
                code: stock.code.clone(),
                signal_type: "BUY".to_string(),
                reason: format!("Oversold: {:.1}% below 25-day average", divergence.abs()),
                date: latest_price.date,
                price_at_signal: latest_price.close,
            });
        }
    }

    // 3. Simple Drop Logic: 5% lower than previous day
    if latest_price.close < prev_price.close * 0.95 {
        return Some(models::SignalInput {
            code: stock.code.clone(),
            signal_type: "BUY".to_string(),
            reason: format!("Sharp Drop: {:.1}% vs yesterday", 
                ((prev_price.close - latest_price.close) / prev_price.close) * 100.0),
            date: latest_price.date,
            price_at_signal: latest_price.close,
        });
    }

    None
}

// Handler for sell signal analysis
pub fn analyze_stock_for_sell(
    stock: &models::Stock,
    prices: &[models::DailyPrice],
    purchase_price: f64,
) -> Option<models::SignalInput> {
    if prices.len() < 30 {
        return None;
    }

    let latest_price = &prices[0];

    // 1. Dead Cross Detection (SMA5 crosses SMA25 downward)
    if let (Some(curr_sma5), Some(curr_sma25), Some(prev_sma5), Some(prev_sma25)) = (
        calculate_sma(prices, 5),
        calculate_sma(prices, 25),
        calculate_sma(&prices[1..], 5),
        calculate_sma(&prices[1..], 25),
    ) {
        if curr_sma5 < curr_sma25 && prev_sma5 >= prev_sma25 {
            return Some(models::SignalInput {
                code: stock.code.clone(),
                signal_type: "SELL".to_string(),
                reason: "Dead Cross (SMA 5/25)".to_string(),
                date: latest_price.date,
                price_at_signal: latest_price.close,
            });
        }
    }

    // 2. 25-day Moving Average Overbought Logic
    if let Some(sma25) = calculate_sma(prices, 25) {
        let divergence = calculate_divergence_rate(latest_price.close, sma25);
        if divergence > 15.0 {
            return Some(models::SignalInput {
                code: stock.code.clone(),
                signal_type: "SELL".to_string(),
                reason: format!("Overbought: {:.1}% above 25-day average", divergence),
                date: latest_price.date,
                price_at_signal: latest_price.close,
            });
        }
    }

    // 3. Profit/Loss Logic
    if latest_price.close > purchase_price * 1.10 {
        return Some(models::SignalInput {
            code: stock.code.clone(),
            signal_type: "SELL".to_string(),
            reason: "Reached 10% profit margin".to_string(),
            date: latest_price.date,
            price_at_signal: latest_price.close,
        });
    }

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
