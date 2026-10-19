fn increase(value: &mut i32) {
    *value += 1;
}

fn main() {
    // 保存访问次数，后续通过受控的可变访问更新。
    let mut visits = 0;

    // 保存计数器的访问入口，后续代码使用它更新或观察计数。
    let counter = &mut visits;
    // 临时重新借用结束后，counter 仍然有效。
    increase(&mut *counter);
    *counter += 2;

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(visits, 3);
}
