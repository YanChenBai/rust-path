---
id: threads-r2-code-1
kind: code
title: 借用数据的并行和
type: question
chapterId: threads
order: 6
assessment:
  explanation: 实现 parallel_sum(values:&[i32])->i64，使用 thread::scope 拆为两部分并行求和。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。
  answerSource: 25-threads/src/bin/threads-r2-code-1.rs?region=answer
  testsSource: 25-threads/src/bin/threads-r2-code-1.rs?region=tests
---

实现 `parallel_sum(values:&[i32])->i64`，使用 `thread::scope` 拆为两部分并行求和。

```rust starter source=25-threads/starters/threads-r2-code-1-starter.rs

```
