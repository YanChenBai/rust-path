// 通过可变借用修改调用者的 String，而不是创建修改后就丢弃的副本。
fn add_tag(name: &mut String) {
    // 把这一段文本追加到可变 String，已有内容不会被覆盖。
    name.push_str(" · Rust");
}

fn main() {
    // 借用只提供临时访问权；共享读取与独占修改不能同时存在。

    // 保存本次示例使用的名称文本，后面用于构造输出或比较。
    let mut name = String::from("小林");
    add_tag(&mut name);

    // 借用现有文本，不创建可增长的字符串容器。
    let borrowed: &str = &name;

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{borrowed}，{} 个字符", borrowed.chars().count());
}
