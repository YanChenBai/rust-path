---
id: enums-r2-code-1
kind: code
title: 状态标签
type: question
chapterId: enums
order: 6
assessment:
  explanation: '实现 state_label(value: Option<u32>) -> String；Some(n) 返回 ready:n，None 返回 pending。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 09-enums/src/bin/enums-r2-code-1.rs?region=answer
  testsSource: 09-enums/src/bin/enums-r2-code-1.rs?region=tests
---

实现 `state_label(value: Option<u32>) -> String`；`Some(n)` 返回 ready:n，`None` 返回 pending。

```rust starter source=09-enums/starters/enums-r2-code-1-starter.rs

```
