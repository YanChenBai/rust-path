fn main() {
    // 注意循环范围是否包含右端点，避免多执行或少执行一次。

    // 累计本次处理结果，后续断言会检查最终数值。
    let mut total = 0;
    for day in 1..=5 {
        total += day;
    }

    // 保存剩余轮数，循环每轮减少它以保证能够结束。
    let mut countdown = 3;
    while countdown > 0 {
        countdown -= 1;
    }

    // 接收 loop 中 break 携带的结果。
    let reward = loop {
        break total * 10;
    };

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("总计 {total}，奖励 {reward} XP");
}
