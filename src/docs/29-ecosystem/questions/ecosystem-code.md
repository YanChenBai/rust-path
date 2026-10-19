---
id: ecosystem-code
kind: code
title: 实现与边界
type: question
chapterId: ecosystem
order: 6
assessment:
  explanation: 派生负责结构校验，业务函数负责领域校验；添加上下文而不丢弃底层错误。
  answerSource: 29-ecosystem/src/bin/ecosystem-code.rs?region=answer
  testsSource: 29-ecosystem/src/bin/ecosystem-code.rs?region=tests
---

定义 `Entry { name: String, minutes: u32 }`，派生 Serialize、Deserialize、`Debug`、PartialEq 并拒绝未知字段；实现 `decode(input: &str) -> anyhow::Result<Entry>`，添加 JSON 解析上下文，拒绝空白名和 1..=180 以外分钟数。

```rust starter source=29-ecosystem/starters/ecosystem-code-starter.rs

```
