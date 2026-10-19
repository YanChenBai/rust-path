---
id: io-code
kind: code
title: 实现与边界
type: question
chapterId: io
order: 6
---

实现 sum_lines&lt;R: `std::io::BufRead`&gt;(reader: R) -&gt; `Result`&lt;`i64`, `String`&gt;：逐行 trim，忽略空行，解析并 checked_add，读取、解析或溢出均返回 `Err`。

```rust starter
fn sum_lines<R: std::io::BufRead>(reader: R) -> Result<i64, String> {
    todo!()
}

fn main() {
    println!("{:?}", sum_lines(std::io::Cursor::new("1\n2\n")));
}
```
