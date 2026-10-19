---
id: models-r2-code-1
kind: code
title: 矩形面积
type: question
chapterId: models
order: 6
assessment:
  explanation: 定义 struct Rectangle { width:u32, height:u32 }，实现 area(&self)->u64，扩大后乘法。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。
  answerSource: 08-models/src/bin/models-r2-code-1.rs?region=answer
  testsSource: 08-models/src/bin/models-r2-code-1.rs?region=tests
---

定义 `struct Rectangle { width:u32, height:u32 }`，实现 `area(&self)->u64`，扩大后乘法。

```rust starter source=08-models/starters/models-r2-code-1-starter.rs

```
