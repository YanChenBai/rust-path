---
id: shutdown-r2-code-2
kind: code
title: 显式观察退出
type: question
chapterId: shutdown
order: 7
---

实现 `async` `fn` stopped() -&gt; `bool`，用 tokio oneshot 发信号，等待接收任务返回 true。

```rust starter
async fn stopped() -> bool {
    todo!()
}

fn main() {
    // 先完成上方函数，再提交边界测试。
}
```
