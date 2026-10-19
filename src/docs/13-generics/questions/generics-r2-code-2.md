---
id: generics-r2-code-2
kind: code
title: 泛型边界判断
type: question
chapterId: generics
order: 7
assessment:
  explanation: '实现 in_range<T: Ord>(value: &T, low: &T, high: &T) -> bool，闭区间，反向区间返回 false。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 13-generics/src/bin/generics-r2-code-2.rs?region=answer
  testsSource: 13-generics/src/bin/generics-r2-code-2.rs?region=tests
---

实现 `in_range<T: Ord>(value: &T, low: &T, high: &T) -> bool`，闭区间，反向区间返回 false。

```rust starter source=13-generics/starters/generics-r2-code-2-starter.rs

```
