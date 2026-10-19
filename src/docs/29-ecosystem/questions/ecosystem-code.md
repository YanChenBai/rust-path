---
id: ecosystem-code
kind: code
title: 实现与边界
type: question
chapterId: ecosystem
order: 6
---

定义 Entry { name: `String`, minutes: `u32` }，派生 Serialize、Deserialize、`Debug`、PartialEq 并拒绝未知字段；实现 decode(input: `&str`) -&gt; `anyhow::Result`&lt;Entry&gt;，添加 JSON 解析上下文，拒绝空白名和 1..=180 以外分钟数。

```rust starter
#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq)]

#[serde(deny_unknown_fields)]

struct Entry {
    name: String,
    minutes: u32,
}

fn decode(input: &str) -> anyhow::Result<Entry> {
    todo!()
}

fn main() {
    println!("{:?}", decode(r#"{"name":"小林","minutes":25}"#));
}
```
