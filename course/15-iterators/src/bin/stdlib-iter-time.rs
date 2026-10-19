use std::time::{Duration, Instant, SystemTime};

fn main() {
    // 记录单调时钟起点，用于测量已经过去的时长。
    let start = Instant::now();

    // 准备待处理的输入序列，后续会读取其中的元素并验证计算结果。
    let values = [0u32, 3, 7];

    // 累计本次处理结果，后续断言会检查最终数值。
    let total: u64 = values
        .iter()
        .copied()
        .filter(|n| *n > 0)
        .map(|n| u64::from(n) * 60)
        .sum();

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(total, 600);

    // 指定允许的耗时预算，避免把时间控制写成隐含常量。
    let budget = Duration::from_secs(1);

    // 取得用于记录的时间值，与单调耗时测量的用途不同。
    let timestamp = SystemTime::now().duration_since(SystemTime::UNIX_EPOCH);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!(
        "耗时 {:?}，预算 {:?}，时间戳 {:?}",
        start.elapsed(),
        budget,
        timestamp
    );
}
