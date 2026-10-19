fn main() {
    // 把名称、分钟数和完成状态组合为一个元组。
    let record = ("小林", 25u32, false);

    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes = [10, 20, 30];

    // 元组按位置读取不同含义的数据，数组下标读取同类元素。
    println!("姓名：{}，分钟：{}", record.0, record.1);
    println!("数组调试形式：{minutes:?}");

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(minutes[1], 20);
    assert_eq!(minutes.len(), 3);
    let (name, duration, done) = record;
    println!("{name} / {duration} / {done}");
}
