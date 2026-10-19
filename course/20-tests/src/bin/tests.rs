fn hours(minutes: u32) -> u32 {
    minutes / 60
}

#[test]
fn handles_zero() {
    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(hours(0), 0);
}

fn main() {
    // 断言检查实际结果；测试通过只说明这些输入满足预期。

    assert_eq!(hours(90), 1);
    assert_eq!(hours(0), 0);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("所有断言通过！");
}
