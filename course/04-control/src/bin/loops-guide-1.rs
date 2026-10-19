fn main() {
    // 累计本次处理结果，后续断言会检查最终数值。
    let mut total = 0;
    for number in 0..=6 {
        if number % 2 != 0 {
            continue;
        }
        total += number;
    }
    let mut remaining = 3;
    while remaining > 0 {
        remaining -= 1;
    }

    // 接收 loop 中 break 携带的结果。
    let reward = loop {
        break total * 2;
    };

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!((total, remaining, reward), (12, 0, 24));
    assert_eq!((3..3).count(), 0);
    assert_eq!((3..=3).count(), 1);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("总计 {total}，奖励 {reward}");
}
