#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq)]
#[serde(deny_unknown_fields)]

struct Record {
    name: String,
    minutes: u32,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 保存当前步骤得到的值，后续通过接口检查或转换。
    let value: Record = serde_json::from_str(r#"{"name":"小林","minutes":25}"#)?;

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert!(!value.name.trim().is_empty());
    assert!((1..=180).contains(&value.minutes));

    // 保存序列化后的 JSON 文本，便于输出或再次解析验证。
    let json = serde_json::to_string(&value)?;
    assert_eq!(serde_json::from_str::<Record>(&json)?, value);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{json}");
    Ok(())
}
