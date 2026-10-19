---
id: modules-r2-code-2
kind: code
title: 只公开构造与读取
type: question
chapterId: modules
order: 7
assessment:
  explanation: 定义 mod model，公开结构体 Counter（私有 u32 字段），pub fn new(n:u32)->Self 与 pub fn get(&self)->u32。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。
  answerSource: 19-modules/src/bin/modules-r2-code-2.rs?region=answer
  testsSource: 19-modules/src/bin/modules-r2-code-2.rs?region=tests
---

定义 mod model，公开结构体 Counter（私有 `u32` 字段），`pub fn new(n:u32)->Self` 与 `pub fn get(&self)->u32`。

```rust starter source=19-modules/starters/modules-r2-code-2-starter.rs

```
