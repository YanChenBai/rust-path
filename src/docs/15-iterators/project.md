---
type: project
chapterId: iterators
id: iterators-project
title: 日志数据流水线
---

把解析、筛选、稳定排序和截取组合起来。

## 验收要求

- 实现 top_minutes(input: `&str`, limit: `usize`) -&gt; `Vec`&lt;`u32`&gt;
- 逐行 trim 并解析 `u32`，忽略非法行和 0；按数值降序排列，保留重复值
- 最多返回 limit 条，limit=0 返回空

```rust starter
fn top_minutes(input: &str, limit: usize) -> Vec<u32> {
    todo!()
}
fn main() {}
```
