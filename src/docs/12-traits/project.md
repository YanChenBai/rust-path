---
type: project
chapterId: traits
id: traits-project
title: 带校验的时长类型
assessment:
  explanation: 组合领域类型、转换契约和错误返回。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 12-traits/src/bin/traits-project.rs?region=answer
  testsSource: 12-traits/src/bin/traits-project.rs?region=tests
---

组合领域类型、转换契约和错误返回。

## 验收要求

- 定义 `#[derive(Debug,PartialEq)] struct Minutes(u32)`
- 实现 `TryFrom<u32>`，错误类型 `String`，只接受 1..=180，失败返回 range
- 实现 `From<Minutes> for u32`，消费包装并返回数值

```rust starter source=12-traits/starters/traits-project-starter.rs

```
