fn main() {
    // 保存待处理的原始输入，清理、解析与筛选都从它开始。
    let input = String::from("  Rust   学习  ");

    // 准备结果字符串，按规则逐步追加内容。
    let mut report = String::new();
    for word in input.split_whitespace() {
        if !report.is_empty() {
            report.push('|');
        }

        // 把这一段文本追加到可变 String，已有内容不会被覆盖。
        report.push_str(word);
    }
    // report 拥有自己的存储，不再借用 input。
    drop(input);

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(report, "Rust|学习");
}
