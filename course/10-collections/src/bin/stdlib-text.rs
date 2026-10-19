use std::collections::{BTreeMap, HashSet};

fn main() {
    // 保存待处理的原始输入，清理、解析与筛选都从它开始。
    let input = "Rust rust 猫";

    // 按名称保存累计结果，缺失键需要显式安排初始值。
    let mut counts = BTreeMap::new();

    // 保存去重后的元素，用于比较集合的语义。
    let mut unique = HashSet::new();
    for word in input.split_whitespace().map(str::to_lowercase) {
        unique.insert(word.clone());
        *counts.entry(word).or_insert(0usize) += 1;
    }

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(unique.len(), 2);
    assert_eq!(counts["rust"], 2);
    assert_eq!("猫".len(), 3);
    assert_eq!("猫".chars().count(), 1);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{counts:?}");
}
