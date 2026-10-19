---
id: traits-r2-code-2
kind: code
title: 受检窄化
type: question
chapterId: traits
order: 7
---

实现 to_byte(n:`u32`)-&gt;`Result`&lt;`u8`,`String`&gt;，超出 `u8` 范围返回 `Err`("range")。

```rust starter
fn to_byte(n: u32) -> Result<u8, String> {
    todo!()
}

fn main() {
    // 先完成上方函数，再提交边界测试。
}
```
