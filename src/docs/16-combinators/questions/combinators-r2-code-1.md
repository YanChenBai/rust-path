---
id: combinators-r2-code-1
kind: code
title: 可选正数
type: question
chapterId: combinators
order: 6
assessment:
  explanation: '实现 parse_optional(input: Option<&str>) -> Option<u32>，解析正整数，缺失、非法或 0 返回 None。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 16-combinators/src/bin/combinators-r2-code-1.rs?region=answer
  testsSource: 16-combinators/src/bin/combinators-r2-code-1.rs?region=tests
---

实现 `parse_optional(input: Option<&str>) -> Option<u32>`，解析正整数，缺失、非法或 0 返回 `None`。

```rust starter source=16-combinators/starters/combinators-r2-code-1-starter.rs

```
