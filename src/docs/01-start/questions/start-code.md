---
id: start-code
kind: code
title: 写一句问候
type: question
chapterId: start
order: 6
---

编写 greeting() -&gt; `String`，返回 Hello, Rust!。 本题函数签名、参数类型和 `main` 都是已提供骨架；先保留它们，只修改 `format!` 的模板文本。

```rust starter
fn greeting() -> String {
    // 保留函数骨架，只把下面的文本改为题目要求的问候语。
    format!("请修改这段文字")
}

fn main() {
    println!("{}", greeting());
}
```
