---
type: project
chapterId: lifetimes
id: lifetimes-project
title: 零复制日志检索
---

借用原始日志，返回首条包含关键词的非空行。

## 验收要求

- 实现 find_line&lt;'a&gt;(input: &'a str, needle: `&str`) -&gt; `Option`&lt;&'a str&gt;
- 返回 trim 后的原文本切片；跳过空行；找不到返回 `None`
- needle 为空时返回首条非空行；不得通过泄漏内存构造 static 引用

```rust starter
fn find_line<'a>(input: &'a str, needle: &str) -> Option<&'a str> {
    todo!()
}
fn main() {}
```
