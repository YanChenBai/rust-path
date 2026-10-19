---
id: threads-r2-code-2
kind: code
title: 通道转移
type: question
chapterId: threads
order: 7
assessment:
  explanation: 实现 relay(values:Vec<String>)->Vec<String>，子线程通过 mpsc 逐个发送拥有值，主线程接收，保留顺序并 join。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。
  answerSource: 25-threads/src/bin/threads-r2-code-2.rs?region=answer
  testsSource: 25-threads/src/bin/threads-r2-code-2.rs?region=tests
---

实现 `relay(values:Vec<String>)->Vec<String>`，子线程通过 mpsc 逐个发送拥有值，主线程接收，保留顺序并 join。

```rust starter source=25-threads/starters/threads-r2-code-2-starter.rs

```
