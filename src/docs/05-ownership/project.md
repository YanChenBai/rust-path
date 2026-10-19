---
type: project
chapterId: ownership
id: ownership-project
title: 拥有权报告封装
---

练习明确的消费接口与独立副本。

## 验收要求

- 实现 archive(text: `String`) -&gt; (`String`,`usize`)
- 返回拥有的原文本与其 UTF-8 字节数；`len` 为已提供标准库方法
- 不得丢失内容；空文本返回空 `String` 和 0

```rust starter
fn archive(text: String) -> (String, usize) {
    todo!()
}
fn main() {}
```
