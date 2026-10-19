fn main() {
    // 从固定文本创建拥有存储的字符串，后续操作以这个值为输入。
    let text = String::from("Rust");

    // 保存长度查询的结果；文本的 len 返回 UTF-8 字节数。
    let size = text.len();

    // 保存大写转换生成的新字符串，原文本不会被这个方法改写。
    let upper = text.to_uppercase();

    // 使用完整模块路径找到 String 类型，与简写类型名的用途相同。
    let qualified = std::string::String::from("完整路径");

    // 方法返回新字符串；原 text 仍然保持原样。
    assert_eq!(size, 4);
    assert_eq!(upper, "RUST");
    assert_eq!(text, "Rust");

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{qualified}");
}
