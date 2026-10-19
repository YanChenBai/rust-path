---
id: macros-code
kind: code
title: 实现与边界
type: question
chapterId: macros
order: 6
---

实现 total_i64! 宏，接受零个或多个逗号分隔表达式和可选尾逗号，每个表达式恰好执行一次，以 `i64::from` 转换后累加，返回 `i64`。输入总和保证不溢出。

```rust starter
macro_rules! total_i64 {
    ($($value:expr),* $(,)?) => {{ todo!() }};
}

fn main() {
    let total: i64 = total_i64!(1, 2,);
    println!("{total}");
}
```
