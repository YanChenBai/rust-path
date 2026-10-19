---
id: shutdown-r2-code-2
kind: code
title: 显式观察退出
type: question
chapterId: shutdown
order: 7
assessment:
  explanation: 实现 async fn stopped() -> bool，用 tokio oneshot 发信号，等待接收任务返回 true。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。
  answerSource: 28-shutdown/src/bin/shutdown-r2-code-2.rs?region=answer
  testsSource: 28-shutdown/src/bin/shutdown-r2-code-2.rs?region=tests
---

实现 `async fn stopped() -> bool`，用 tokio oneshot 发信号，等待接收任务返回 true。

```rust starter source=28-shutdown/starters/shutdown-r2-code-2-starter.rs

```
