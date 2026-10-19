---
type: project
chapterId: threads
id: threads-project
title: 并行分段统计
assessment:
  explanation: 组合借用、线程返回值与边界计算，避免共享可变状态。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 25-threads/src/bin/threads-project.rs?region=answer
  testsSource: 25-threads/src/bin/threads-project.rs?region=tests
---

组合借用、线程返回值与边界计算，避免共享可变状态。

## 验收要求

- 实现 `stats(values:&[i32])->(usize,i64)`，返回正数数量与全部元素之和
- 使用 scope 启动两个线程处理两半数据，扩大为 `i64` 后累加
- 奇数长度和空输入也应正确；等待所有线程结果

```rust starter source=25-threads/starters/threads-project-starter.rs

```
