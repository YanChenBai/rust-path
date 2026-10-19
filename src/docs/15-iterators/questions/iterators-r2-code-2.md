---
id: iterators-r2-code-2
kind: code
title: 接受闭包参数
type: question
chapterId: iterators
order: 7
---

实现 apply_twice&lt;F: FnMut(`i32`) -&gt; `i32`&gt;(value: `i32`, f: F) -&gt; `i32`，返回 f(f(value))。

```rust starter
fn apply_twice<F: FnMut(i32) -> i32>(value: i32, mut f: F) -> i32 {
    todo!()
}

fn main() {
    // 先完成上方函数，再提交边界测试。
}
```
