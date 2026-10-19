---
type: project
chapterId: borrowing
id: borrowing-project
title: 借用式余额转移
assessment:
  explanation: 不复制账户，使用两个独占引用完成一次转账。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 06-borrowing/src/bin/borrowing-project.rs?region=answer
  testsSource: 06-borrowing/src/bin/borrowing-project.rs?region=tests
---

不复制账户，使用两个独占引用完成一次转账。

## 验收要求

- 实现 `transfer(from: &mut u32, to: &mut u32, amount: u32) -> bool`
- 余额不足或目标加法溢出时返回 false，两个余额均不得改变
- 成功返回 true；金额为 0 合法

```rust starter source=06-borrowing/starters/borrowing-project-starter.rs

```
