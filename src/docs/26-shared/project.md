---
type: project
chapterId: shared
id: shared-project
title: 共享库存并发扣减
assessment:
  explanation: 组合 Arc、Mutex、线程等待与业务不变量。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 26-shared/src/bin/shared-project.rs?region=answer
  testsSource: 26-shared/src/bin/shared-project.rs?region=tests
---

组合 Arc、Mutex、线程等待与业务不变量。

## 验收要求

- 实现 `sell(stock: u32, requests: Vec<u32>) -> (u32, usize)`
- 每条请求放入独立线程，库存足够才原子地扣减并计入成功次数；请求 0 合法
- 返回剩余库存与成功次数；并发顺序不作保证，但所有成功扣减必须守住库存约束

```rust starter source=26-shared/starters/shared-project-starter.rs

```
