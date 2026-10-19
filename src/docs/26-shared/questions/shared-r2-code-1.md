---
id: shared-r2-code-1
kind: code
title: 线程安全计数
type: question
chapterId: shared
order: 6
assessment:
  explanation: '实现 concurrent_count(workers: usize, each: usize) -> usize，每线程增加 each 次，共享 Arc<Mutex<usize>> 并等待全部线程；输入总数不溢出。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 26-shared/src/bin/shared-r2-code-1.rs?region=answer
  testsSource: 26-shared/src/bin/shared-r2-code-1.rs?region=tests
---

实现 `concurrent_count(workers: usize, each: usize) -> usize`，每线程增加 each 次，共享 `Arc<Mutex<usize>>` 并等待全部线程；输入总数不溢出。

```rust starter source=26-shared/starters/shared-r2-code-1-starter.rs

```
