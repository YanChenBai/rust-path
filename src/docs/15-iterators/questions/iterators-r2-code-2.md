---
id: iterators-r2-code-2
kind: code
title: 接受闭包参数
type: question
chapterId: iterators
order: 7
assessment:
  explanation: '实现 apply_twice<F: FnMut(i32) -> i32>(value: i32, f: F) -> i32，返回 f(f(value))。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 15-iterators/src/bin/iterators-r2-code-2.rs?region=answer
  testsSource: 15-iterators/src/bin/iterators-r2-code-2.rs?region=tests
---

实现 `apply_twice<F: FnMut(i32) -> i32>(value: i32, f: F) -> i32`，返回 f(f(value))。

```rust starter source=15-iterators/starters/iterators-r2-code-2-starter.rs

```
