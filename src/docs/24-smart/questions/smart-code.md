---
id: smart-code
kind: code
title: 实现与边界
type: question
chapterId: smart
order: 6
assessment:
  explanation: 借用失败与算术溢出都不修改原值，守卫退出作用域后释放借用。
  answerSource: 24-smart/src/bin/smart-code.rs?region=answer
  testsSource: 24-smart/src/bin/smart-code.rs?region=tests
---

实现 `try_add(cell: &RefCell<i32>, delta: i32) -> bool`：借用冲突或加法溢出返回 false 且不修改原值，否则更新并返回 true。

```rust starter source=24-smart/starters/smart-code-starter.rs

```
