---
id: ecosystem-extra-choice-1
kind: choice
title: 读取 JSON 计划
options:
  - '25'
  - Some(25)
  - None
  - Some("25")
type: question
chapterId: ecosystem
order: 1
---

```rust
let plan: serde_json::Value = serde_json::from_str(r#"{"minutes":25,"done":false}"#).unwrap();
println!("{:?}", plan["minutes"].as_u64()); 输出什么？
```
