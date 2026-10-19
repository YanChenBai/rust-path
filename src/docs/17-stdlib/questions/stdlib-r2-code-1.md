---
id: stdlib-r2-code-1
kind: code
title: 范围分类
type: question
chapterId: stdlib
order: 6
assessment:
  explanation: 实现 classify(value:Option<u32>)->&'static str，None 为 missing，Some(0) 为 zero，1..=180 为 valid，其余 range。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。
  answerSource: 17-stdlib/src/bin/stdlib-r2-code-1.rs?region=answer
  testsSource: 17-stdlib/src/bin/stdlib-r2-code-1.rs?region=tests
---

实现 `classify(value:Option<u32>)->&'static str`，`None` 为 missing，`Some(0)` 为 zero，1..=180 为 valid，其余 range。

```rust starter source=17-stdlib/starters/stdlib-r2-code-1-starter.rs

```
