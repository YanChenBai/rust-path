fn main() {
    // 保存当前步骤得到的值，后续通过接口检查或转换。
    let mut value = Some(String::from("Rust"));

    // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
    match &value {
        Some(text) => assert_eq!(text, "Rust"),
        None => panic!("固定示例有值"),
    }
    // 用合法替代状态换出原数据，而不是从借用中直接移出。
    let taken = value.take();

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(taken.as_deref(), Some("Rust"));
    assert!(value.is_none());
}
