fn label(value: Option<u32>) -> String {
    let Some(n) = value else {
        return String::from("missing");
    };

    // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
    match n {
        value @ 1..=180 => format!("valid:{value}"),
        0 => String::from("zero"),
        _ => String::from("range"),
    }
}

fn main() {
    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(label(Some(25)), "valid:25");
    assert_eq!(label(None), "missing");
    assert_eq!(label(Some(0)), "zero");
}
