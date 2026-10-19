---
type: project
chapterId: shutdown
id: shutdown-project
title: 可关闭的数据处理管道
assessment:
  explanation: 组合异步通道、类型转换和顺序处理，建立完整退出边界。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 28-shutdown/src/bin/shutdown-project.rs?region=answer
  testsSource: 28-shutdown/src/bin/shutdown-project.rs?region=tests
---

组合异步通道、类型转换和顺序处理，建立完整退出边界。

## 验收要求

- 实现 `async fn pipeline(values: Vec<u32>) -> Vec<u64>`
- 用有界通道把输入发送给独立任务，逐项扩大为 `u64` 后乘 2
- 保持输入顺序；关闭发送端，等待处理任务；空输入能正常退出

```rust starter source=28-shutdown/starters/shutdown-project-starter.rs

```
