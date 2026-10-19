---
id: models-r2-code-2
kind: code
title: 饱和计数器
type: question
chapterId: models
order: 7
assessment:
  explanation: 定义 Counter { value:u32 }，实现 add(&mut self,n:u32)，溢出时停在 u32::MAX。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。
  answerSource: 08-models/src/bin/models-r2-code-2.rs?region=answer
  testsSource: 08-models/src/bin/models-r2-code-2.rs?region=tests
---

定义 `Counter { value:u32 }`，实现 `add(&mut self,n:u32)`，溢出时停在 `u32::MAX`。

```rust starter source=08-models/starters/models-r2-code-2-starter.rs

```
