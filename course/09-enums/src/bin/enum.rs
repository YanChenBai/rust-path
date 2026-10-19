enum Status {
    Learning(u32),
    Completed,
}

fn main() {
    // 枚举用不同变体表达状态；match 分别处理每种情况。

    // 用枚举保存当前状态，避免用多个布尔值表达互斥情况。
    let status = Status::Learning(30);

    // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
    match status {
        Status::Learning(xp) => println!("已积累 {xp} XP"),
        Status::Completed => println!("学习完成"),
    }

    // 构造带有数据的枚举变体，再通过模式匹配读取。
    let next = Some("集合");
    if let Some(title) = next {
        // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
        println!("下一站：{title}");
    }
}
