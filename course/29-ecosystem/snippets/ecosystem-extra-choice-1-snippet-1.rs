let plan: serde_json::Value = serde_json::from_str(r#"{"minutes":25,"done":false}"#).unwrap();
println!("{:?}", plan["minutes"].as_u64());
