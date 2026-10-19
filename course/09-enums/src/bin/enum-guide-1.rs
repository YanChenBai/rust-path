enum State {
    Waiting,
    Learning { minutes: u32 },
    Done(String),
}

fn describe(state: &State) -> String {
    // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
    match state {
        State::Waiting => String::from("等待开始"),
        State::Learning { minutes } => format!("已学 {minutes} 分钟"),
        State::Done(title) => format!("完成 {title}"),
    }
}

fn main() {
    let states = [
        State::Waiting,
        State::Learning { minutes: 25 },
        State::Done(String::from("枚举")),
    ];
    for state in &states {
        // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
        println!("{}", describe(state));
    }

    // 构造带有数据的枚举变体，再通过模式匹配读取。
    let next: Option<&str> = None;

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(next.unwrap_or("全部完成"), "全部完成");
    assert_ne!(Some(""), next);
}
