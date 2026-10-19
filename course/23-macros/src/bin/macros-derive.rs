#[derive(Debug, Clone, PartialEq, Eq)]

struct Config {
    name: String,
    retries: u8,
}

fn main() {
    // 保留未处理的输入，方便对比方法是否修改原数据。
    let original = Config {
        name: "local".into(),
        retries: 2,
    };

    // 调用派生的 Clone 创建副本，用相等比较验证派生行为。
    let mut copy = original.clone();

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(original, copy);
    copy.retries += 1;
    assert_ne!(original, copy);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{original:?}");
}
