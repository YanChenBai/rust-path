---
id: shutdown-r2-code-1
kind: code
title: 排空有界队列
type: question
chapterId: shutdown
order: 6
assessment:
  explanation: '实现 async fn drain_sum(values: Vec<u32>) -> u64，使用容量 1 的 tokio mpsc 通道发送并累计，关闭发送端并等待消费者。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 28-shutdown/src/bin/shutdown-r2-code-1.rs?region=answer
  testsSource: 28-shutdown/src/bin/shutdown-r2-code-1.rs?region=tests
---

实现 `async fn drain_sum(values: Vec<u32>) -> u64`，使用容量 1 的 tokio mpsc 通道发送并累计，关闭发送端并等待消费者。

```rust starter source=28-shutdown/starters/shutdown-r2-code-1-starter.rs

```
