enum State {
    Pending,
    Done(u32),
}

fn label(state: &State) -> String {
    // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
    match state {
        State::Pending => String::from("等待"),
        State::Done(count) => format!("完成 {count} 项"),
    }
}

fn main() {
    // 创建具体状态，再通过借用交给显示逻辑。
    let state = State::Done(3);

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(label(&state), "完成 3 项");
    assert_eq!(label(&State::Pending), "等待");
}
