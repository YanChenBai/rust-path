---
id: macros-extra-code
kind: code
title: 生成标签列表宏
type: question
chapterId: macros
order: 7
---

定义 macro_rules! labels，支持 labels!()、labels!(expr, expr) 及可选尾逗号，返回 `Vec`&lt;`String`&gt;。每个表达式只求值一次，按顺序通过 `format!`("{}", 值) 转换。另实现 sample_labels() -&gt; `Vec`&lt;`String`&gt;，调用 labels!("Rust", 2024) 返回示例。

```rust starter
macro_rules! labels {
    // 匹配零个或多个表达式，允许尾逗号
    ($($value:expr),* $(,)?) => {{ todo!() }};
}

fn sample_labels() -> Vec<String> {
    todo!()
}

fn main() {
    println!("{:?}", sample_labels());
}
```
