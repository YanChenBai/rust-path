---
id: combinators-r2-code-2
kind: code
title: 保留缺失与错误
type: question
chapterId: combinators
order: 7
assessment:
  explanation: '实现 optional_number(input: Option<&str>) -> Result<Option<u32>, String>，不 trim；非法文本返回 Err("invalid")。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 16-combinators/src/bin/combinators-r2-code-2.rs?region=answer
  testsSource: 16-combinators/src/bin/combinators-r2-code-2.rs?region=tests
---

实现 `optional_number(input: Option<&str>) -> Result<Option<u32>, String>`，不 trim；非法文本返回 `Err("invalid")`。

```rust starter source=16-combinators/starters/combinators-r2-code-2-starter.rs

```
