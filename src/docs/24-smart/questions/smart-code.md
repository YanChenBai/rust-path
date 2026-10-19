---
id: smart-code
kind: code
title: 实现与边界
type: question
chapterId: smart
order: 6
---

实现 try_add(cell: &RefCell&lt;`i32`&gt;, delta: `i32`) -&gt; `bool`：借用冲突或加法溢出返回 false 且不修改原值，否则更新并返回 true。

```rust starter
fn try_add(cell: &std::cell::RefCell<i32>, delta: i32) -> bool {
    todo!()
}

fn main() {
    let n = std::cell::RefCell::new(1);
    assert!(try_add(&n, 2));
}
```
