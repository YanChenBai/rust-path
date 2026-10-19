fn main() {
    // 用有符号整数记录温度，因此可以表示零下温度。
    let temperature: i32 = -3;

    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes: u32 = 25;

    // 用浮点数保存除法结果，避免整数除法丢弃小数。
    let ratio: f64 = 5.0 / 2.0;

    // 用布尔值记录是否完成，不用数字代替真假。
    let finished: bool = false;

    // 保存一个 Unicode 标量值；单引号表示 char。
    let symbol: char = '你';

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{temperature} / {minutes} / {ratio} / {finished} / {symbol}");

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(5 / 2, 2);
    assert_eq!(ratio, 2.5);
}
