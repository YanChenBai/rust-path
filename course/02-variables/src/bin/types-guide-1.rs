fn main() {
    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes: u32 = 95;
    let hours = f64::from(minutes) / 60.0;
    let summary: (u32, u32) = (minutes / 60, minutes % 60);
    let checkpoints: [u32; 3] = [0, 60, 120];

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(summary, (1, 35));
    assert_eq!(255_u8.checked_add(1), None);
    assert!(u8::try_from(300_u16).is_err());

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{hours:.3} 小时，{summary:?}，{}", checkpoints[1]);
}
