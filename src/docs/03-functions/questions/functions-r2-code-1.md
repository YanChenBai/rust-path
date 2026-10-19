---
id: functions-r2-code-1
kind: code
title: 分钟换算函数
type: question
chapterId: functions
order: 6
assessment:
  explanation: 实现 minutes(hours:u32, extra:u32)->u64，计算小时转分钟后加 extra，先扩大整数避免溢出。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。
  answerSource: 03-functions/src/bin/functions-r2-code-1.rs?region=answer
  testsSource: 03-functions/src/bin/functions-r2-code-1.rs?region=tests
---

实现 `minutes(hours:u32, extra:u32)->u64`，计算小时转分钟后加 extra，先扩大整数避免溢出。

```rust starter source=03-functions/starters/functions-r2-code-1-starter.rs

```
