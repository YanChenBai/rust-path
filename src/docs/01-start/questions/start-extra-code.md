---
id: start-extra-code
kind: code
title: 可复用的签到标签
type: question
chapterId: start
order: 7
assessment:
  explanation: format! 返回 String；直接捕获参数，不清理名字中的空格，也不对天数额外加一。
  answerSource: 01-start/src/bin/start-extra-code.rs?region=answer
  testsSource: 01-start/src/bin/start-extra-code.rs?region=tests
---

实现 `checkin(name: &str, day: u32) -> String`，返回“名字：第 N 天”。保留名字原样，包括空串和空格；例如 checkin("Ada", 2) 返回 "Ada：第 2 天"。 本题函数签名、参数类型和 `main` 都是已提供骨架；先保留它们，只修改 `format!` 的模板文本。

```rust starter source=01-start/starters/start-extra-code-starter.rs

```
