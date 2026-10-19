---
id: errors-r2-code-2
kind: code
title: 范围校验
type: question
chapterId: errors
order: 7
---

实现 parse_limit(input:`&str`)-&gt;`Result`&lt;`u32`,`String`&gt;，trim 后解析并限制 1..=180；格式错误为 format，范围错误为 range。

```rust starter
fn parse_limit(input: &str) -> Result<u32, String> {
    todo!()
}

fn main() {
    // 先完成上方函数，再提交边界测试。
}
```
