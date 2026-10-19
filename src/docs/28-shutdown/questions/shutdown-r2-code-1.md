---
id: shutdown-r2-code-1
kind: code
title: 排空有界队列
type: question
chapterId: shutdown
order: 6
---

实现 `async` `fn` drain_sum(values: `Vec`&lt;`u32`&gt;) -&gt; `u64`，使用容量 1 的 tokio mpsc 通道发送并累计，关闭发送端并等待消费者。

```rust starter
async fn drain_sum(values: Vec<u32>) -> u64 {
    todo!()
}

fn main() {
    // 先完成上方函数，再提交边界测试。
}
```
