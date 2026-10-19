---
id: traits-r2-code-2
kind: code
title: 受检窄化
type: question
chapterId: traits
order: 7
assessment:
  explanation: 实现 to_byte(n:u32)->Result<u8,String>，超出 u8 范围返回 Err("range")。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。
  answerSource: 12-traits/src/bin/traits-r2-code-2.rs?region=answer
  testsSource: 12-traits/src/bin/traits-r2-code-2.rs?region=tests
---

实现 `to_byte(n:u32)->Result<u8,String>`，超出 `u8` 范围返回 `Err("range")`。

```rust starter source=12-traits/starters/traits-r2-code-2-starter.rs

```
