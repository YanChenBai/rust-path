fn main() {
    // 保留未处理的输入，方便对比方法是否修改原数据。
    let original = "  Rust  ";

    // 保存去除外侧空白后的文本视图，原输入保持不变。
    let cleaned = original.trim();

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(original, "  Rust  ");
    assert_eq!(cleaned, "Rust");

    // 从固定文本创建拥有存储的字符串，后续操作以这个值为输入。
    let mut text = String::from(cleaned);

    // 保存大写转换生成的新字符串，原文本不会被这个方法改写。
    let upper = text.to_uppercase();

    // 把这一段文本追加到可变 String，已有内容不会被覆盖。
    text.push_str(" language");
    assert_eq!(upper, "RUST");
    assert_eq!(text, "Rust language");

    // 准备待处理的输入序列，后续会读取其中的元素并验证计算结果。
    let values = [10, 20, 30];
    assert_eq!(values.len(), 3);
    assert_eq!((-7i32).abs(), 7);
    assert_eq!(2u32.pow(3), 8);
}
