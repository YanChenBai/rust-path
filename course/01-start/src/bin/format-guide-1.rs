fn main() {
    // 保存本次示例使用的名称文本，后面用于构造输出或比较。
    let name = "小林";

    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes = 95;
    let hours = f64::from(minutes) / 60.0;
    // 保留原始精度，只在展示时指定小数位。
    let report = format!("{name}：{hours:.2} 小时");

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{report}");
    println!("编号 {minutes:03}，记录 {:?}", [15, 30]);
    println!("配置示意：{{分钟: {minutes}}}");
}
