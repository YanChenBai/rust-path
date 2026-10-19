fn main() {
    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes: u32 = 60;
    let is_member = true;
    let rate: u32 = if is_member { 8 } else { 10 };
    let label = if minutes >= 90 {
        "长时专注"
    } else if minutes >= 60 {
        "达成一小时"
    } else {
        "短时练习"
    };

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(label, "达成一小时");
    assert_eq!(rate * 2, 16);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{label}，两小时费用：{}", rate * 2);
}
