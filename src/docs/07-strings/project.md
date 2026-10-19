---
type: project
chapterId: strings
id: strings-project
title: 中文学习日志摘要
---

把文本清洗、Unicode 计数与集合组合成报告。

## 验收要求

- 实现 summarize(input: `&str`, limit: `usize`) -&gt; `Vec`&lt;`String`&gt;
- 忽略空白行，每行先 trim，再取前 limit 个 Unicode 标量值
- 保持原行顺序；limit=0 时每条非空记录变为空字符串

```rust starter
fn summarize(input: &str, limit: usize) -> Vec<String> {
    todo!()
}
fn main() {}
```
