fn parse_minutes(input: &str) -> Result<u32, String> {
    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes = input
        .trim()
        .parse::<u32>()
        .map_err(|error| format!("无法解析分钟数：{error}"))?;
    if !(1..=180).contains(&minutes) {
        return Err(format!("分钟数 {minutes} 不在 1 到 180 之间"));
    }
    Ok(minutes)
}

fn main() {
    for input in [" 25 ", "0", "abc", "181"] {
        // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
        match parse_minutes(input) {
            Ok(minutes) => println!("接受 {minutes} 分钟"),
            Err(error) => println!("拒绝 {input:?}：{error}"),
        }
    }

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(parse_minutes("180"), Ok(180));
    assert!(parse_minutes("0").is_err());
}
