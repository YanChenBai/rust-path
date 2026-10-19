---
id: ecosystem-extra-code
kind: code
title: 验证 JSON 学习计划
type: question
chapterId: ecosystem
order: 7
assessment:
  explanation: 只使用 serde_json::Value，先确认顶层对象，再取字段、验证整数类型和范围。所有解析或业务校验失败映射为统一错误，不需要额外第三方依赖。
  answerSource: 29-ecosystem/src/bin/ecosystem-extra-code.rs?region=answer
  testsSource: 29-ecosystem/src/bin/ecosystem-extra-code.rs?region=tests
---

只依赖 serde_json，实现 `plan_minutes(input: &str) -> Result<u64, String>`。解析 JSON，顶层必须是对象；minutes 字段须能通过 `Value::as_u64` 得到 1..=180 的整数。忽略额外字段。所有失败统一返回 "无效计划"。字符串数字、浮点数、负数、缺失字段和非法 JSON 都必须拒绝。

```rust starter source=29-ecosystem/starters/ecosystem-extra-code-starter.rs

```
