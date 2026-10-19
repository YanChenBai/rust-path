fn parse_minutes(input: &str) -> Result<u32, std::num::ParseIntError> {
    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes = input.parse::<u32>()?;
    Ok(minutes)
}

fn main() {
    // Result 把失败写进返回类型，调用者必须处理成功与错误。

    // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
    match parse_minutes("25") {
        Ok(n) => println!("计划学习 {n} 分钟"),
        Err(e) => println!("输入有误：{e}"),
    }
}
