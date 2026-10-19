fn main() {
    // 从固定文本创建拥有存储的字符串，后续操作以这个值为输入。
    let mut text = String::from("你a");

    // 保存原始拥有值，后续用它对比移动和显式克隆的区别。
    let first: &str = &text;

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("修改前：{first}");
    text.push('好');

    let editable = &mut text;
    editable.push('!');

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(text.len(), 8);
    assert_eq!(text.chars().count(), 4);
    assert_eq!(text.get(0..3), Some("你"));
    assert_eq!(text.get(0..1), None);
    let combined = "é";
    assert_eq!(combined.chars().count(), 2);
    println!("修改后：{text}，组合文本：{combined}");
}
