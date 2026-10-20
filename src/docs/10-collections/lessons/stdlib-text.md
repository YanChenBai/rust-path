---
id: stdlib-text
title: String、HashSet 与 BTreeMap
subtitle: 先明确数据语义，再选择容器
minutes: 18
type: lesson
chapterId: collections
order: 1
advanced: true
---

## 字节、字符和排序规则不是同一个概念。

`String` 保存拥有所有权的 UTF-8 字节，`&str` 是有效 UTF-8 的借用视图。`len` 返回字节数，chars 遍历 Unicode 标量值，不能用任意整数下标直接取得字符。即使 chars 数量相同，用户看到的字形也可能由多个标量组成；标准库不提供完整的字形簇分段。处理文本时应先明确题目要的是字节、标量还是自然语言单词。

HashSet 适合快速判断成员和去重，但遍历顺序不保证稳定，不能把其当前输出顺序写进测试。BTreeMap 以键的 Ord 顺序遍历，适合稳定报表和范围查询。这里的字符串顺序是 Rust 的字符串排序规则，不是中文拼音或语言学排序。需要哈希去重又需要稳定输出时，可以收集到 `Vec` 后显式排序。

示例按空白拆分文本，以 to_lowercase 统一大小写后累计词频；这只是明确约定的正规化方式，不等同于完整 Unicode 大小写折叠。entry 把查询和插入合并成一次接口操作，不需要先 contains_key 再插入。选择 `String` 作为键会拥有文本，允许报表在原始输入销毁后继续使用，也承担了对应分配成本。

<CourseCallout>

split_whitespace 不移除标点；题目没有要求时不要擅自把 Rust! 当作 Rust。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

用 HashSet 去重后排序，并对空输入、重复中文和不同大小写编写断言。

</CourseCallout>

```rust playground id=stdlib-text source=10-collections/src/bin/stdlib-text.rs

```
