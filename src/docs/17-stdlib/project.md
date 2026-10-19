---
type: project
chapterId: stdlib
id: stdlib-project
title: 嵌套结果分类器
---

组合 `Option`、`Result`、范围模式与借用观察。

## 验收要求

- 实现 classify_rows(rows:&[`Option`&lt;`Result`&lt;`u32`,`String`&gt;&gt;])-&gt;(`usize`,`usize`,`usize`)
- 分别统计有效值（1..=180）、缺失（`None`）、非法（`Err` 或范围外 `Ok`）
- 只能借用输入，返回三个计数；空输入均为 0

```rust starter
fn classify_rows(rows: &[Option<Result<u32, String>>]) -> (usize, usize, usize) {
    todo!()
}
fn main() {}
```
