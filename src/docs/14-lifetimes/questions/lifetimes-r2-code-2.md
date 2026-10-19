---
id: lifetimes-r2-code-2
kind: code
title: 两个来源的返回关系
type: question
chapterId: lifetimes
order: 7
---

实现 choose&lt;'a&gt;(left: &'a str, right: &'a str, use_left: `bool`) -&gt; &'a str，按布尔值返回原切片。

```rust starter
fn choose<'a>(left: &'a str, right: &'a str, use_left: bool) -> &'a str {
    todo!()
}

fn main() {
    // 先完成上方函数，再提交边界测试。
}
```
