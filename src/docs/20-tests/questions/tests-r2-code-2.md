---
id: tests-r2-code-2
kind: code
title: 避免绝对值溢出
type: question
chapterId: tests
order: 7
assessment:
  explanation: '实现 distance(a: i32, b: i32) -> u64，计算非负距离，包括 i32 两端。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 20-tests/src/bin/tests-r2-code-2.rs?region=answer
  testsSource: 20-tests/src/bin/tests-r2-code-2.rs?region=tests
---

实现 `distance(a: i32, b: i32) -> u64`，计算非负距离，包括 `i32` 两端。

```rust starter source=20-tests/starters/tests-r2-code-2-starter.rs

```
