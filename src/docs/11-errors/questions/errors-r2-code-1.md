---
id: errors-r2-code-1
kind: code
title: 安全整数除法
type: question
chapterId: errors
order: 6
assessment:
  explanation: 实现 divide(a:u32,b:u32)->Option<u32>，除数 0 返回 None，否则整数商。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。
  answerSource: 11-errors/src/bin/errors-r2-code-1.rs?region=answer
  testsSource: 11-errors/src/bin/errors-r2-code-1.rs?region=tests
---

实现 `divide(a:u32,b:u32)->Option<u32>`，除数 0 返回 `None`，否则整数商。

```rust starter source=11-errors/starters/errors-r2-code-1-starter.rs

```
