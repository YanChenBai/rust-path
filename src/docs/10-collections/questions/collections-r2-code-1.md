---
id: collections-r2-code-1
kind: code
title: 按键累加
type: question
chapterId: collections
order: 6
assessment:
  explanation: '实现 totals(values: &[(&str,u32)]) -> std::collections::HashMap<String,u64>，按名称汇总，先扩大数值。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 10-collections/src/bin/collections-r2-code-1.rs?region=answer
  testsSource: 10-collections/src/bin/collections-r2-code-1.rs?region=tests
---

实现 `totals(values: &[(&str,u32)]) -> std::collections::HashMap<String,u64>`，按名称汇总，先扩大数值。

```rust starter source=10-collections/starters/collections-r2-code-1-starter.rs

```
