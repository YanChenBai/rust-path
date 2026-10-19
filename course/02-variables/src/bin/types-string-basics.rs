fn main() {
    // 借用现有文本，不创建可增长的字符串容器。
    let borrowed: &str = "Ada";

    // 创建拥有存储的 String，后续追加操作会修改它。
    let mut owned: String = String::from(borrowed);

    // 创建空字符串，用来观察 is_empty 对空值的判断。
    let empty = String::new();

    // 一次追加字符串切片，一次追加单个字符。
    owned.push_str(" 学习 Rust");
    owned.push('!');

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{owned}");

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert!(empty.is_empty());
    assert_eq!("你好".len(), 6);
    assert_eq!(format!("你好，{borrowed}"), "你好，Ada");
}
