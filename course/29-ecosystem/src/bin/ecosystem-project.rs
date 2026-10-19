// region:answer
use clap::Parser;
#[derive(Parser)]
struct Args { #[arg(long)] json: String }
#[derive(serde::Serialize, serde::Deserialize)]
#[serde(deny_unknown_fields)]
struct Record { name: String, minutes: u32 }
#[derive(Debug, thiserror::Error)]
enum RecordError {
    #[error("名字不能为空")] EmptyName,
    #[error("分钟必须为 1..=180")] InvalidMinutes,
}
fn validate(record: &Record) -> Result<(), RecordError> {
    if record.name.trim().is_empty() { return Err(RecordError::EmptyName); }
    if !(1..=180).contains(&record.minutes) { return Err(RecordError::InvalidMinutes); }
    Ok(())
}
fn execute(args: &[&str]) -> anyhow::Result<String> {
    use anyhow::Context;
    let args = Args::try_parse_from(args).context("命令行参数错误")?;
    let record: Record = serde_json::from_str(&args.json).context("JSON 解析失败")?;
    validate(&record)?;
    let span = tracing::info_span!("record", minutes = record.minutes);
    let _guard = span.enter();
    tracing::info!("记录校验通过");
    serde_json::to_string(&record).context("JSON 编码失败")
}
// endregion:answer

fn main() {
// region:tests
let result = execute(&["study", "--json", r#"{"name":"甲","minutes":25}"#]).unwrap();
let value: serde_json::Value = serde_json::from_str(&result).unwrap();
assert_eq!(value["name"], "甲"); assert_eq!(value["minutes"], 25);
assert!(execute(&["study"]).is_err()); assert!(execute(&["study", "--unknown"]).is_err());
assert!(execute(&["study", "--json", "{}"]).is_err());
let error = execute(&["study", "--json", r#"{"name":"a","minutes":0}"#]).unwrap_err();
assert!(matches!(error.downcast_ref::<RecordError>(), Some(RecordError::InvalidMinutes)));
assert!(execute(&["study", "--json", r#"{"name":" ","minutes":1}"#]).is_err());
// endregion:tests
    println!("__PASS__");
}
