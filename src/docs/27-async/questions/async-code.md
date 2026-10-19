---
id: async-code
kind: code
title: 实现与边界
type: question
chapterId: async
order: 6
assessment:
  explanation: 在异步函数内部 spawn，通过持有并等待所有句柄保持输入顺序；同步断言入口自行创建运行时。
  answerSource: 27-async/src/bin/async-code.rs?region=answer
  testsSource: 27-async/src/bin/async-code.rs?region=tests
---

实现 `async fn doubled(values: Vec<u32>) -> Vec<u64>`：逐项 `tokio::spawn`，以 `u64` 加倍，等待全部任务并按输入顺序输出。空输入返回空列表。

```rust starter source=27-async/starters/async-code-starter.rs

```
