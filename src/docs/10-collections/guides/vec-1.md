---
type: guide
lessonId: vec
index: 1
title: 顺序记录与按键汇总使用不同容器
---

### 2. 顺序记录与按键汇总使用不同容器

示例先用 `Vec` 保留记录顺序，再用 `HashMap` 按名字累计分钟数。entry 查找键并返回入口，or_insert 在键缺失时建立零值，并给出可变引用，解引用后即可累加。取值使用 get，找到时得到借用，未找到时得到 `None`。最终按固定名字顺序读取，避免把 `HashMap` 未承诺的遍历顺序当作排行榜顺序。

```rust runnable id=vec-guide-1
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
```
