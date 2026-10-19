fn decorate(mut text: String) -> String {
    // 把这一段文本追加到可变 String，已有内容不会被覆盖。
    text.push_str(" · 已完成");
    text
}

fn main() {
    // 保留未处理的输入，方便对比方法是否修改原数据。
    let original = String::from("所有权练习");

    // 显式保留一份独立文本，后续移动不会拿走这份副本。
    let backup = original.clone();
    let decorated = decorate(original);

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(backup, "所有权练习");
    assert_eq!(decorated, "所有权练习 · 已完成");

    // 保存当前计数，用于对比操作之前与之后的状态。
    let count = 3_u32;

    // 创建独立副本，后续修改不会影响原来的字符串。
    let copied = count;

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{backup} / {decorated} / {}", count + copied);
}
