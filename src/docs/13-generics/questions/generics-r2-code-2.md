---
id: generics-r2-code-2
kind: code
title: 泛型边界判断
type: question
chapterId: generics
order: 7
---

实现 in_range&lt;T: Ord&gt;(value: &T, low: &T, high: &T) -&gt; `bool`，闭区间，反向区间返回 false。

```rust starter
fn in_range<T: Ord>(value: &T, low: &T, high: &T) -> bool {
    todo!()
}

fn main() {
    // 先完成上方函数，再提交边界测试。
}
```
