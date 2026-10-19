fn main() {
    // String 按值赋值会转移所有权，原绑定随后不能继续使用。

    // 创建拥有文本的 String，用来观察赋值后谁负责管理它。
    let name = String::from("探索者");

    // clone 创建独立文本，用于对照移动与复制的区别。
    let backup = name.clone();

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("原始名字：{name}");
    println!("备份名字：{backup}");
}
