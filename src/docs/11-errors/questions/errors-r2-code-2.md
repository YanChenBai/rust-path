---
id: errors-r2-code-2
kind: code
title: 范围校验
type: question
chapterId: errors
order: 7
assessment:
  explanation: 实现 parse_limit(input:&str)->Result<u32,String>，trim 后解析并限制 1..=180；格式错误为 format，范围错误为 range。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。
  answerSource: 11-errors/src/bin/errors-r2-code-2.rs?region=answer
  testsSource: 11-errors/src/bin/errors-r2-code-2.rs?region=tests
---

实现 `parse_limit(input:&str)->Result<u32,String>`，trim 后解析并限制 1..=180；格式错误为 format，范围错误为 range。

```rust starter source=11-errors/starters/errors-r2-code-2-starter.rs

```
