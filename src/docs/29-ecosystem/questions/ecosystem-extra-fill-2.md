---
id: ecosystem-extra-fill-2
kind: fill
title: 提取无符号整数
type: question
chapterId: ecosystem
order: 5
---

填 Value 的方法名：

```rust
let plan = serde_json::json!({"minutes": 25});
let minutes: Option<u64> = plan["minutes"].____();
assert_eq!(minutes, Some(25));
```
