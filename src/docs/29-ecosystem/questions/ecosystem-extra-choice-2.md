---
id: ecosystem-extra-choice-2
kind: choice
title: 字符串不是 JSON 数字
options:
  - Some(25)
  - Some(0)
  - None
  - 运行时 panic：索引不能用于 Value
type: question
chapterId: ecosystem
order: 2
---

```rust
let plan = serde_json::json!({"minutes": "25"});
println!("{:?}", plan["minutes"].as_u64()); 输出什么？
```
