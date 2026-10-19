---
id: stdlib-text
title: String、HashSet 与 BTreeMap
subtitle: 先明确数据语义，再选择容器
minutes: 18
type: lesson
chapterId: collections
order: 1
---

## 字节、字符和排序规则不是同一个概念。

`String` 保存拥有所有权的 UTF-8 字节，`&str` 是有效 UTF-8 的借用视图。`len` 返回字节数，chars 遍历 Unicode 标量值，不能用任意整数下标直接取得字符。即使 chars 数量相同，用户看到的字形也可能由多个标量组成；标准库不提供完整的字形簇分段。处理文本时应先明确题目要的是字节、标量还是自然语言单词。

HashSet 适合快速判断成员和去重，但遍历顺序不保证稳定，不能把其当前输出顺序写进测试。BTreeMap 以键的 Ord 顺序遍历，适合稳定报表和范围查询。这里的字符串顺序是 Rust 的字符串排序规则，不是中文拼音或语言学排序。需要哈希去重又需要稳定输出时，可以收集到 `Vec` 后显式排序。

示例按空白拆分文本，以 to_lowercase 统一大小写后累计词频；这只是明确约定的正规化方式，不等同于完整 Unicode 大小写折叠。entry 把查询和插入合并成一次接口操作，不需要先 contains_key 再插入。选择 `String` 作为键会拥有文本，允许报表在原始输入销毁后继续使用，也承担了对应分配成本。

<CourseCallout>

split_whitespace 不移除标点；题目没有要求时不要擅自把 Rust! 当作 Rust。

</CourseCallout>

## 亲手试一试

```rust playground id=stdlib-text
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
```

<CourseCallout title="给自己一个小挑战">

用 HashSet 去重后排序，并对空输入、重复中文和不同大小写编写断言。

</CourseCallout>
