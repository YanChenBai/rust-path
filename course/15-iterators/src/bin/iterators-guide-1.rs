fn main() {
    // 准备待处理的输入序列，后续会读取其中的元素并验证计算结果。
    let values = vec![10_u32, 30, 5, 45];

    // 记录闭包或表达式实际执行次数，用于验证执行时机。
    let mut calls = 0;
    let scores = {
        let mut pipeline =
            values
                .iter()
                .copied()
                .filter(|value| *value >= 25)
                .map(|value| {
                    calls += 1;
                    value * 2
                });

        // 保存原始拥有值，后续用它对比移动和显式克隆的区别。
        let first = pipeline.next();

        // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
        assert_eq!(first, Some(60));

        // 保存这一阶段返回的结果，后续检查它的实际内容或成功状态。
        let mut result = vec![first.expect("已有首项")];
        result.extend(pipeline);
        result
    };
    assert_eq!(calls, 2);
    assert_eq!(scores, vec![60, 90]);

    // 累计本次处理结果，后续断言会检查最终数值。
    let total: u32 = scores.iter().sum();
    assert_eq!(values.len(), 4);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{scores:?}，总计 {total}，转换 {calls} 次");
}
