---
id: collections-r2-code-2
kind: code
title: 安全访问
type: question
chapterId: collections
order: 7
assessment:
  explanation: 实现 at(values:&[i32], index:usize)->Option<i32>，有效返回元素副本，否则 None。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。
  answerSource: 10-collections/src/bin/collections-r2-code-2.rs?region=answer
  testsSource: 10-collections/src/bin/collections-r2-code-2.rs?region=tests
---

实现 `at(values:&[i32], index:usize)->Option<i32>`，有效返回元素副本，否则 `None`。

```rust starter source=10-collections/starters/collections-r2-code-2-starter.rs

```
