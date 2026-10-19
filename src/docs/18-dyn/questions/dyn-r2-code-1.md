---
id: dyn-r2-code-1
kind: code
title: 统一读取接口
type: question
chapterId: dyn
order: 6
---

定义 `trait` Value { `fn` value(&self) -&gt; `i32`; }，实现 total(items: &[&dyn Value]) -&gt; `i64`，先扩大整数再求和。

```rust starter
trait Value { fn value(&self) -> i32; }

fn total(items: &[&dyn Value]) -> i64 {
    todo!()
}

fn main() {}
```
