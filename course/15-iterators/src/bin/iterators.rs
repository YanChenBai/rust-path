fn main() {
    // 迭代器描述处理步骤，消费操作才会驱动这条处理链。

    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes = vec![10, 30, 5, 45];

    // 构建筛选后的处理流程；迭代器通常在消费时才执行。
    let focused: Vec<u32> = minutes
        .iter()
        .copied()
        .filter(|n| *n >= 25)
        .map(|n| n * 2)
        .collect();

    // 累计本次处理结果，后续断言会检查最终数值。
    let total: u32 = focused.iter().sum();

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("积分：{focused:?}，总计 {total}");
}
