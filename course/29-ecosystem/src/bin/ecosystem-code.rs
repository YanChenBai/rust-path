// region:answer
#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq)]
#[serde(deny_unknown_fields)]
struct Entry {
    name: String,
    minutes: u32,
}
fn decode(input: &str) -> anyhow::Result<Entry> {
    use anyhow::Context;
    let entry: Entry = serde_json::from_str(input).context("JSON 解析失败")?;
    anyhow::ensure!(!entry.name.trim().is_empty(), "名字不能为空");
    anyhow::ensure!((1..=180).contains(&entry.minutes), "分钟越界");
    Ok(entry)
}
// endregion:answer

fn main() {
    // region:tests
    let entry = decode(r#"{"name":"小林","minutes":25}"#).unwrap();
    assert_eq!(entry.minutes, 25);
    let json = serde_json::to_string(&entry).unwrap();
    assert_eq!(decode(&json).unwrap(), entry);
    for bad in [
        "{}",
        "not json",
        r#"{"name":" ","minutes":1}"#,
        r#"{"name":"A","minutes":0}"#,
        r#"{"name":"A","minutes":181}"#,
        r#"{"name":"A","minutes":1,"extra":2}"#,
    ] {
        assert!(decode(bad).is_err());
    }
    // endregion:tests
    println!("__PASS__");
}
