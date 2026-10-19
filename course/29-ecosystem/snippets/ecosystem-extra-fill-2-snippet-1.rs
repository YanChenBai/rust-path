let plan = serde_json::json!({"minutes": 25});
let minutes: Option<u64> = plan["minutes"].____();
assert_eq!(minutes, Some(25));
