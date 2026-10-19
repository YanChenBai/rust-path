---
type: project
chapterId: borrowing
id: borrowing-project
title: 借用式余额转移
---

不复制账户，使用两个独占引用完成一次转账。

## 验收要求

- 实现 transfer(from: &`mut` `u32`, to: &`mut` `u32`, amount: `u32`) -&gt; `bool`
- 余额不足或目标加法溢出时返回 false，两个余额均不得改变
- 成功返回 true；金额为 0 合法

```rust starter
fn transfer(from: &mut u32, to: &mut u32, amount: u32) -> bool {
    todo!()
}
fn main() {}
```
