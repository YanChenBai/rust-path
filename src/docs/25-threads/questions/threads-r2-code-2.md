---
id: threads-r2-code-2
kind: code
title: 通道转移
type: question
chapterId: threads
order: 7
---

实现 relay(values:`Vec`&lt;`String`&gt;)-&gt;`Vec`&lt;`String`&gt;，子线程通过 mpsc 逐个发送拥有值，主线程接收，保留顺序并 join。

```rust starter
fn relay(values: Vec<String>) -> Vec<String> {
    todo!()
}

fn main() {
    // 先完成上方函数，再提交边界测试。
}
```
