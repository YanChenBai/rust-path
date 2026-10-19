fn main() {
    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes = " 30 ";

    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes: u32 = minutes.trim().parse().expect("固定示例应为整数");

    // 累计本次处理结果，后续断言会检查最终数值。
    let mut total = minutes;
    total += 15;

    {
        // 保存学习时长或时长序列，后续按分钟规则处理。
        let minutes = minutes * 2;

        // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
        assert_eq!(minutes, 60);

        // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
        println!("块内：{minutes}");
    }

    assert_eq!(minutes, 30);
    assert_eq!(total, 45);
    println!("块外：{minutes}，总计：{total}");
}
