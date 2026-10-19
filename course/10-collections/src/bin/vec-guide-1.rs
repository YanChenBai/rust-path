use std::collections::HashMap;

fn main() {
    let mut records = Vec::with_capacity(4);

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(records.len(), 0);
    records.push(("Ada", 20_u32));
    records.push(("Lin", 30));
    records.push(("Ada", 15));

    let mut totals = HashMap::new();
    for &(name, minutes) in &records {
        *totals.entry(name).or_insert(0_u32) += minutes;
    }
    assert_eq!(records.get(3), None);
    assert_eq!(totals.get("Ada"), Some(&35));
    for name in ["Ada", "Lin"] {
        // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
        println!("{name}：{}", totals.get(name).copied().unwrap_or(0));
    }
}
