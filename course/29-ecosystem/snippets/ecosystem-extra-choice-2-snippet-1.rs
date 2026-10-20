let plan = serde_json::json!({"minutes": "25"});
println!("{:?}", plan["minutes"].as_u64());
