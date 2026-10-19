// region:answer
fn plan_minutes(input: &str) -> Result<u64, String> {
    let plan: serde_json::Value = serde_json::from_str(input)
        .map_err(|_| "无效计划".to_string())?;
    let minutes = plan.as_object()
        .and_then(|object| object.get("minutes"))
        .and_then(serde_json::Value::as_u64)
        .filter(|n| (1..=180).contains(n));
    minutes.ok_or_else(|| "无效计划".to_string())
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(plan_minutes(r#"{"minutes":25}"#), Ok(25));
assert_eq!(plan_minutes(r#"{"minutes":1,"name":"小林"}"#), Ok(1));
assert_eq!(plan_minutes("  {\"minutes\":180}\n"), Ok(180));
for input in ["", "bad", "null", "[]", "25", r#"{}"#, r#"{"minutes":0}"#, r#"{"minutes":181}"#, r#"{"minutes":-1}"#, r#"{"minutes":25.0}"#, r#"{"minutes":"25"}"#, r#"{"minutes":true}"#, r#"{"minutes":null}"#, r#"{"minutes":18446744073709551616}"#, r#"{"minutes":25} trailing"#] {
    assert_eq!(plan_minutes(input), Err("无效计划".into()), "input: {input}");
}
// endregion:tests
    println!("__PASS__");
}
