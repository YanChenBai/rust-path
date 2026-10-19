---
id: traits-r2-code-1
kind: code
title: 实现行为契约
type: question
chapterId: traits
order: 6
assessment:
  explanation: 定义 trait Score { fn score(&self)->i32; } 和 Fixed(i32)，为 Fixed 实现 Score。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。
  answerSource: 12-traits/src/bin/traits-r2-code-1.rs?region=answer
  testsSource: 12-traits/src/bin/traits-r2-code-1.rs?region=tests
---

定义 `trait Score { fn score(&self)->i32; }` 和 `Fixed(i32)`，为 Fixed 实现 Score。

```rust starter source=12-traits/starters/traits-r2-code-1-starter.rs

```
