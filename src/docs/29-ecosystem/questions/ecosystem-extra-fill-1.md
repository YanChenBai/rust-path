---
id: ecosystem-extra-fill-1
kind: fill
title: 解析不可信 JSON
type: question
chapterId: ecosystem
order: 4
---

填 serde_json 的函数名，将文本解析为 Value：

```rust
let plan: serde_json::Value = serde_json::____(r#"{"minutes":25}"#).unwrap();
```
