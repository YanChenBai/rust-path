---
type: project
chapterId: combinators
id: combinators-project
title: 带行号的严格导入
---

结合迭代与错误上下文，保证数据没有被静默丢弃。

## 验收要求

- 实现 parse_rows(input: `&str`) -&gt; `Result`&lt;`Vec`&lt;`u32`&gt;, `String`&gt;
- 跳过空白行，按原始行号从 1 计数；合法 `u32`（含 0）保留
- 首个非法行返回 line:N，其中 N 是原始行号

```rust starter
fn parse_rows(input: &str) -> Result<Vec<u32>, String> {
    todo!()
}
fn main() {}
```
