use futures::future::join_all;
use regex::Regex;
use scraper::{Html, Selector};
use serde::{Serialize};
use serde_json::{Map, Value};
use worker::*;

// Set up a panic hook to log errors to the console
fn set_panic_hook() {
    console_error_panic_hook::set_once();
}

/// Defines a known location for financial data within the __PRELOADED_STATE__ JSON.
struct DataSource {
    path: &'static [&'static str],
    mappings: std::collections::HashMap<&'static str, &'static str>,
    strip_suffix: bool,
}

/// Represents the final JSON response for a single code.
#[derive(Serialize, Debug)]
struct CodeResult {
    code: String,
    data: Option<Map<String, Value>>,
    error: Option<String>,
}

/// Main worker entry point.
#[event(fetch)]
pub async fn main(req: Request, _env: Env, _ctx: Context) -> Result<Response> {
    set_panic_hook();

    let url = req.url()?;
    let path = url.path();
    let query_params: std::collections::HashMap<String, String> = url.query_pairs().into_owned().collect();

    // Check if this is an API request (has 'code' parameter)
    if query_params.contains_key("code") {
        // API request - handle stock data
        let codes_str = query_params.get("code").unwrap();
        
        let codes: Vec<String> = codes_str
            .split(',')
            .filter(|s| !s.is_empty())
            .map(|s| s.trim().to_string())
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

        let mut response = Response::from_json(&results)?;
        let headers = response.headers_mut();
        headers.set("Access-Control-Allow-Origin", "*")?;
        headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")?;
        headers.set("Access-Control-Allow-Headers", "Content-Type")?;
        Ok(response)
    } else {
        // Static file request - serve embedded HTML (CSS/JS are inlined)
        serve_static_file(path)
    }
}

/// Serves the embedded HTML file (with inlined CSS/JS)
fn serve_static_file(path: &str) -> Result<Response> {
    match path {
        "/" | "/index.html" => {
            let html = include_str!("../public/index.html");
            Response::from_html(html)
        }
        _ => Response::error("Not found", 404),
    }
}

/// Fetches and processes data for a single stock code.
async fn fetch_single_code(code: String, keys: Option<Vec<String>>) -> CodeResult {
    let url = if code.starts_with('^') || code.contains('=') || code.ends_with(".T") || code.ends_with(".O") {
        format!("https://finance.yahoo.co.jp/quote/{}/", code)
    } else {
        format!("https://finance.yahoo.co.jp/quote/{}.T/", code)
    };

    let body = match Fetch::Url(url.parse().unwrap()).send().await {
        Ok(mut resp) => match resp.text().await {
            Ok(text) => text,
            Err(e) => return CodeResult { code, data: None, error: Some(format!("Failed to read response text: {}", e)) },
        },
        Err(e) => return CodeResult { code, data: None, error: Some(format!("Failed to fetch URL: {}", e)) },
    };

    let re = Regex::new(r"(?s)window\.__PRELOADED_STATE__\s*=\s*(.*?)</script>").unwrap();

    let result_data: Result<Map<String, Value>> = if let Some(caps) = re.captures(&body) {
        if let Some(json_match) = caps.get(1) {
            let mut json_str = json_match.as_str().trim();
            if json_str.ends_with(';') {
                json_str = &json_str[..json_str.len() - 1];
            }

            match serde_json::from_str(json_str) {
                Ok(data) => process_json_data(&code, &data, &body, keys.as_ref()),
                Err(e) => Err(worker::Error::from(format!("Failed to parse JSON: {}", e))),
            }
        } else {
            // JSON not found, fallback to DOM
            process_dom_data(&code, &body, keys.as_ref())
        }
    } else {
        // __PRELOADED_STATE__ script not found, fallback to DOM
        process_dom_data(&code, &body, keys.as_ref())
    };

    match result_data {
        Ok(data) => CodeResult { code, data: Some(data), error: None },
        Err(e) => CodeResult { code, data: None, error: Some(e.to_string()) },
    }
}

/// Processes the __PRELOADED_STATE__ JSON data to find financial info.
fn process_json_data(code: &str, data: &Value, body: &str, keys: Option<&Vec<String>>) -> Result<Map<String, Value>> {
    let data_sources = get_data_sources();

    // 1. Try predefined paths
    for source in &data_sources {
        if let Some(value_at_path) = find_value_at_path(data, source.path) {
            let objects_to_search: Vec<&Map<String, Value>> = if let Some(arr) = value_at_path.as_array() {
                // If the path leads to an array, collect all objects in that array
                arr.iter().filter_map(|v| v.as_object()).collect()
            } else if let Some(obj) = value_at_path.as_object() {
                // If it's a single object, treat it as a list with one item
                vec![obj]
            } else {
                // Not an array or an object, so we can't search it
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
                                // `keys` is present, return all data
                                results = target_obj.clone();
                                results.insert("code".to_string(), Value::String(code.to_string()));
                            } else {
                                // `keys` is absent, return minimal data
                                let minimal_keys = vec!["code".to_string(), "name".to_string(), "price".to_string(), "price_change".to_string(), "price_change_rate".to_string(), "update_time".to_string()];
                                for key in &minimal_keys {
                                    if let Some(json_key) = source.mappings.get(key.as_str()) {
                                        if let Some(value) = target_obj.get(*json_key) {
                                            let str_val = value.to_string().trim_matches('"').to_string();
                                            results.insert(key.clone(), Value::String(str_val));
                                        }
                                    } else if key == "code" {
                                        results.insert("code".to_string(), Value::String(code.to_string()));
                                    }
                                }
                            }

                            // Fix for missing price/change data (e.g. when market is closed)
                            if let Some(price_val) = results.get("price") {
                                if price_val.as_str() == Some("---") {
                                    // Try to use savePrice if available
                                    if let Some(save_price) = target_obj.get("savePrice") {
                                         let str_val = save_price.to_string().trim_matches('"').to_string();
                                         results.insert("price".to_string(), Value::String(str_val));
                                    }
                                }
                            }

                            // Calculate price change if missing
                            let price_change_missing = results.get("price_change").map_or(true, |v| v.as_str() == Some("---"));
                            if price_change_missing {
                                if let Some(price_str) = results.get("price").and_then(|v| v.as_str()) {
                                    if price_str != "---" {
                                        // Parse current price
                                        let current_price = price_str.replace(',', "").parse::<f64>().unwrap_or(0.0);
                                        
                                        // Scrape previous close from DOM
                                        let document = Html::parse_document(body);
                                        let prev_close_selector = Selector::parse("section[class*='StocksEtfReitDataList'] ul li:first-child dd span[class*='StyledNumber__value']").unwrap();
                                        
                                        if let Some(prev_close_el) = document.select(&prev_close_selector).next() {
                                            let prev_close_str = prev_close_el.text().collect::<String>().trim().to_string();
                                            let prev_close = prev_close_str.replace(',', "").parse::<f64>().unwrap_or(0.0);

                                            if prev_close > 0.0 {
                                                let change = current_price - prev_close;
                                                let change_rate = (change / prev_close) * 100.0;

                                                results.insert("price_change".to_string(), Value::String(format!("{:.1}", change)));
                                                results.insert("price_change_rate".to_string(), Value::String(format!("{:.2}", change_rate)));
                                            }
                                        }
                                    }
                                }
                            }

                            results.insert("status".to_string(), Value::String("OK".to_string()));
                            results.insert("source".to_string(), Value::String("json_predefined".to_string()));
                            return Ok(results);
                        }
                    }
                }
            }
        }
    }

    // 2. Fallback to generic key search
    let fallback_keys_to_find = vec!["code".to_string()];
    let mut found_paths = Vec::new();
    find_object_paths(data, &fallback_keys_to_find, &mut Vec::new(), &mut found_paths);

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
                        // `keys` is present, return all data
                        results = obj_map.clone();
                        results.insert("code".to_string(), Value::String(code.to_string()));
                    } else {
                        // `keys` is absent, return minimal data
                        let minimal_keys = vec!["code".to_string(), "name".to_string(), "price".to_string(), "price_change".to_string(), "price_change_rate".to_string(), "update_time".to_string()];
                        for key in &minimal_keys {
                            if let Some(json_key) = fallback_mappings.get(key.as_str()) {
                                if let Some(value) = obj_map.get(*json_key) {
                                    let str_val = value.to_string().trim_matches('"').to_string();
                                    results.insert(key.clone(), Value::String(str_val));
                                }
                            } else if key == "code" {
                                results.insert("code".to_string(), Value::String(code.to_string()));
                            }
                        }
                    }
                    results.insert("status".to_string(), Value::String("OK".to_string()));
                    results.insert("source".to_string(), Value::String("json_fallback".to_string()));
                    return Ok(results);
                }
            }
        }
    }

    Err(worker::Error::from("Could not find matching data in JSON."))
}

/// Processes the HTML body using CSS selectors as a fallback.
fn process_dom_data(code: &str, body: &str, keys: Option<&Vec<String>>) -> Result<Map<String, Value>> {
    let document = Html::parse_document(body);
    let mut results = Map::new();

    // Create a map of known keys to their selectors
    let mut selector_map = std::collections::HashMap::new();
    selector_map.insert("name", "h1");
    selector_map.insert("price", "div[class*='_CommonPriceBoard__priceBlock'] span[class*='_StyledNumber__value']");
    selector_map.insert("price_change", "span[class*='_PriceChangeLabel__primary'] span[class*='_StyledNumber__value']");
    selector_map.insert("price_change_rate", "span[class*='_PriceChangeLabel__secondary'] span[class*='_StyledNumber__value']");
    selector_map.insert("update_time", "li[class*='_CommonPriceBoard__time'] time, span[class*='_Time']");

    let keys_to_process = if keys.is_some() {
        // `keys` is present, process all known fields
        vec![
            "code".to_string(),
            "name".to_string(),
            "price".to_string(),
            "price_change".to_string(),
            "price_change_rate".to_string(),
            "update_time".to_string(),
        ]
    } else {
        // `keys` is absent, process minimal fields
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
        let value = match key.as_str() {
            "code" => Some(code.to_string()),
            _ => {
                if let Some(selector_str) = selector_map.get(key.as_str()) {
                    let selector = Selector::parse(selector_str).unwrap();
                    document.select(&selector).next().map(|el| el.text().collect::<String>().trim().to_string())
                } else {
                    None
                }
            }
        };
        if let Some(val) = value {
            results.insert(key.clone(), Value::String(val));
        }
    }
    
    // Ensure essential keys are present if requested, or if no keys were requested (defaults used)
    if keys_to_process.contains(&"name".to_string()) && !results.contains_key("name") {
         return Err(worker::Error::from("Failed to scrape essential data (name) from DOM."));
    }
    if keys_to_process.contains(&"price".to_string()) && !results.contains_key("price") {
         return Err(worker::Error::from("Failed to scrape essential data (price) from DOM."));
    }

    results.insert("status".to_string(), Value::String("OK".to_string()));
    results.insert("source".to_string(), Value::String("dom_fallback".to_string()));

    Ok(results)
}

// --- Helper Functions ---

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
