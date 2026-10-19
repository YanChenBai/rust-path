---
id: dyn-r2-code-2
kind: code
title: 实现具体对象
type: question
chapterId: dyn
order: 7
assessment:
  explanation: 定义 trait Named { fn name(&self) -> &str; }，结构体 User(String)，为 User 实现 Named。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。
  answerSource: 18-dyn/src/bin/dyn-r2-code-2.rs?region=answer
  testsSource: 18-dyn/src/bin/dyn-r2-code-2.rs?region=tests
---

定义 `trait Named { fn name(&self) -> &str; }`，结构体 `User(String)`，为 User 实现 Named。

```rust starter source=18-dyn/starters/dyn-r2-code-2-starter.rs

```
