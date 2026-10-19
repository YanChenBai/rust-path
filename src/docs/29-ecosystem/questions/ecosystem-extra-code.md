---
id: ecosystem-extra-code
kind: code
title: 验证 JSON 学习计划
type: question
chapterId: ecosystem
order: 7
---

只依赖 serde_json，实现 plan_minutes(input: `&str`) -&gt; `Result`&lt;`u64`, `String`&gt;。解析 JSON，顶层必须是对象；minutes 字段须能通过 `Value::as_u64` 得到 1..=180 的整数。忽略额外字段。所有失败统一返回 "无效计划"。字符串数字、浮点数、负数、缺失字段和非法 JSON 都必须拒绝。

```rust starter
fn plan_minutes(input: &str) -> Result<u64, String> {
    todo!()
}

fn main() {
    println!("{:?}", plan_minutes(r#"{"minutes":25}"#));
}
```
