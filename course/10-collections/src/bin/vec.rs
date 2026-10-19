use std::collections::HashMap;

fn main() {
    // Vec 拥有元素；修改集合时要留意已有引用的有效范围。

    // 保存学习时长或时长序列，后续按分钟规则处理。
    let mut minutes = vec![20, 30, 15];
    minutes.push(45);

    // 按名称保存累计结果，缺失键需要显式安排初始值。
    let mut counts = HashMap::new();
    for value in &minutes {
        *counts.entry("总分钟").or_insert(0) += value;
    }

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{counts:?}");
}
