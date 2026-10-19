---
id: combinators-r2-code-2
kind: code
title: 保留缺失与错误
type: question
chapterId: combinators
order: 7
---

实现 optional_number(input: `Option`&lt;`&str`&gt;) -&gt; `Result`&lt;`Option`&lt;`u32`&gt;, `String`&gt;，不 trim；非法文本返回 `Err`("invalid")。

```rust starter
fn optional_number(input: Option<&str>) -> Result<Option<u32>, String> {
    todo!()
}

fn main() {
    // 先完成上方函数，再提交边界测试。
}
```
