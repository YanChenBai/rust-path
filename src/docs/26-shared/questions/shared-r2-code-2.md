---
id: shared-r2-code-2
kind: code
title: 独占更新
type: question
chapterId: shared
order: 7
---

实现 withdraw(balance: &`std::sync::Mutex`&lt;`u32`&gt;, amount: `u32`) -&gt; `bool`；锁中毒或余额不足时 false，否则扣减并返回 true。

```rust starter
fn withdraw(balance: &std::sync::Mutex<u32>, amount: u32) -> bool {
    todo!()
}

fn main() {
    // 先完成上方函数，再提交边界测试。
}
```
