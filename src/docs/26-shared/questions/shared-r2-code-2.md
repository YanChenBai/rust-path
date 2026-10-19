---
id: shared-r2-code-2
kind: code
title: 独占更新
type: question
chapterId: shared
order: 7
assessment:
  explanation: '实现 withdraw(balance: &std::sync::Mutex<u32>, amount: u32) -> bool；锁中毒或余额不足时 false，否则扣减并返回 true。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 26-shared/src/bin/shared-r2-code-2.rs?region=answer
  testsSource: 26-shared/src/bin/shared-r2-code-2.rs?region=tests
---

实现 `withdraw(balance: &std::sync::Mutex<u32>, amount: u32) -> bool`；锁中毒或余额不足时 false，否则扣减并返回 true。

```rust starter source=26-shared/starters/shared-r2-code-2-starter.rs

```
