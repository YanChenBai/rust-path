---
id: modules-r2-code-1
kind: code
title: 公开的受限数值
type: question
chapterId: modules
order: 6
assessment:
  explanation: '定义 mod domain，其中 pub fn clamp(n: u32) -> u32 返回 min(n,180)。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 19-modules/src/bin/modules-r2-code-1.rs?region=answer
  testsSource: 19-modules/src/bin/modules-r2-code-1.rs?region=tests
---

定义 mod domain，其中 `pub fn clamp(n: u32) -> u32` 返回 min(n,180)。

```rust starter source=19-modules/starters/modules-r2-code-1-starter.rs

```
