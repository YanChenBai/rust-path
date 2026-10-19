---
id: tests-r2-code-1
kind: code
title: 修复向上取整
type: question
chapterId: tests
order: 6
assessment:
  explanation: '实现 pages(items: u32, size: u32) -> Option<u32>；size=0 返回 None，否则向上取整，不能溢出。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 20-tests/src/bin/tests-r2-code-1.rs?region=answer
  testsSource: 20-tests/src/bin/tests-r2-code-1.rs?region=tests
---

实现 `pages(items: u32, size: u32) -> Option<u32>`；size=0 返回 `None`，否则向上取整，不能溢出。

```rust starter source=20-tests/starters/tests-r2-code-1-starter.rs

```
