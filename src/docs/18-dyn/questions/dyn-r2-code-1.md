---
id: dyn-r2-code-1
kind: code
title: 统一读取接口
type: question
chapterId: dyn
order: 6
assessment:
  explanation: '定义 trait Value { fn value(&self) -> i32; }，实现 total(items: &[&dyn Value]) -> i64，先扩大整数再求和。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 18-dyn/src/bin/dyn-r2-code-1.rs?region=answer
  testsSource: 18-dyn/src/bin/dyn-r2-code-1.rs?region=tests
---

定义 `trait Value { fn value(&self) -> i32; }`，实现 `total(items: &[&dyn Value]) -> i64`，先扩大整数再求和。

```rust starter source=18-dyn/starters/dyn-r2-code-1-starter.rs

```
