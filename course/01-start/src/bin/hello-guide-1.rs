fn greet() {
    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("你好，Rust 学习者！");
}

fn main() {
    println!("开始");
    greet();
    println!("结束");
}
