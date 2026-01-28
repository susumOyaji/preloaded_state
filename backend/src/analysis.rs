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

/// Calculate the Relative Strength Index (RSI) for a given period
fn calculate_rsi(prices: &[models::DailyPrice], period: usize) -> Option<f64> {
    if prices.len() < period + 1 {
        return None;
    }

    let mut gains = 0.0;
    let mut losses = 0.0;

    // Prices are [today, yesterday, ..., oldest]
    // Loop through the period to calculate total gains and losses
    for i in 0..period {
        let current = prices[i].close;
        let prev = prices[i + 1].close;
        let diff = current - prev;
        if diff > 0.0 {
            gains += diff;
        } else {
            losses += diff.abs();
        }
    }

    if gains + losses == 0.0 {
        return Some(50.0); // Neutral
    }

    let rs = gains / losses;
    let rsi = 100.0 - (100.0 / (1.0 + rs));
    Some(rsi)
}

/// Calculate the average volume for a given period
fn calculate_avg_volume(prices: &[models::DailyPrice], period: usize) -> Option<f64> {
    if prices.len() < period {
        return None;
    }
    let sum: i64 = prices.iter().take(period).map(|p| p.volume).sum();
    Some(sum as f64 / period as f64)
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
    if prices.len() < 30 {
        return None;
    }

    let latest_price = &prices[0];
    let prev_price = &prices[1];
    let rsi = calculate_rsi(prices, 14);
    let avg_vol = calculate_avg_volume(prices, 20);

    // 1. RSI Oversold with Volume Spike (Strong Reversal Signal)
    if let (Some(r), Some(vol)) = (rsi, avg_vol) {
        if r < 30.0 && latest_price.volume as f64 > vol * 1.5 {
            return Some(models::SignalInput {
                code: stock.code.clone(),
                signal_type: "BUY".to_string(),
                reason: format!("Oversold Reversal: RSI {:.1} with Volume Spike ({:.1}x avg)", r, (latest_price.volume as f64 / vol)),
                date: latest_price.date,
                price_at_signal: latest_price.close,
            });
        }
    }

    // 2. Golden Cross Detection (SMA5 crosses SMA25 upward)
    if let (Some(curr_sma5), Some(curr_sma25), Some(prev_sma5), Some(prev_sma25)) = (
        calculate_sma(prices, 5),
        calculate_sma(prices, 25),
        calculate_sma(&prices[1..], 5),
        calculate_sma(&prices[1..], 25),
    ) {
        if curr_sma5 > curr_sma25 && prev_sma5 <= prev_sma25 {
            // Check RSI to avoid buying at overbought
            if rsi.unwrap_or(50.0) < 65.0 {
                return Some(models::SignalInput {
                    code: stock.code.clone(),
                    signal_type: "BUY".to_string(),
                    reason: "Golden Cross (SMA 5/25)".to_string(),
                    date: latest_price.date,
                    price_at_signal: latest_price.close,
                });
            }
        }
    }

    // 3. Trend Breakout (Price crosses above SMA25)
    if let Some(sma25) = calculate_sma(prices, 25) {
        let prev_sma25 = calculate_sma(&prices[1..], 25).unwrap_or(sma25);
        if latest_price.close > sma25 && prev_price.close <= prev_sma25 {
            return Some(models::SignalInput {
                code: stock.code.clone(),
                signal_type: "BUY".to_string(),
                reason: "Price broke above SMA 25 (Trend reversal)".to_string(),
                date: latest_price.date,
                price_at_signal: latest_price.close,
            });
        }
    }

    // 4. RSI Extreme Deep Dive Rebound
    if let Some(r) = rsi {
        if r < 20.0 {
            return Some(models::SignalInput {
                code: stock.code.clone(),
                signal_type: "BUY".to_string(),
                reason: format!("Extreme Oversold: RSI {:.1}", r),
                date: latest_price.date,
                price_at_signal: latest_price.close,
            });
        }
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
    let prev_price = &prices[1];
    let rsi = calculate_rsi(prices, 14);

    // 1. RSI Overbought (Profit taking signal)
    if let Some(r) = rsi {
        if r > 75.0 {
            return Some(models::SignalInput {
                code: stock.code.clone(),
                signal_type: "SELL".to_string(),
                reason: format!("Overbought risk: RSI {:.1}", r),
                date: latest_price.date,
                price_at_signal: latest_price.close,
            });
        }
    }

    // 2. profit-taking (Reached 10% gain)
    if latest_price.close > purchase_price * 1.10 {
        return Some(models::SignalInput {
            code: stock.code.clone(),
            signal_type: "SELL".to_string(),
            reason: format!("Profit taking: 10% gain reached (Price: ¥{})", latest_price.close),
            date: latest_price.date,
            price_at_signal: latest_price.close,
        });
    }

    // 3. Stop Loss (Dropped 5% from purchase)
    if latest_price.close < purchase_price * 0.95 {
        return Some(models::SignalInput {
            code: stock.code.clone(),
            signal_type: "SELL".to_string(),
            reason: format!("Stop loss: 5% drop reached (Price: ¥{})", latest_price.close),
            date: latest_price.date,
            price_at_signal: latest_price.close,
        });
    }

    // 4. Dead Cross Detection (SMA5 crosses SMA25 downward)
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

    // 5. Trend Breakdown (Price crosses below SMA25)
    if let Some(sma25) = calculate_sma(prices, 25) {
        let prev_sma25 = calculate_sma(&prices[1..], 25).unwrap_or(sma25);
        if latest_price.close < sma25 && prev_price.close >= prev_sma25 {
            return Some(models::SignalInput {
                code: stock.code.clone(),
                signal_type: "SELL".to_string(),
                reason: "Price dropped below SMA 25 (Trend broken)".to_string(),
                date: latest_price.date,
                price_at_signal: latest_price.close,
            });
        }
    }

    None
}
