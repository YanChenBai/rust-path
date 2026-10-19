---
id: network-extra-fill-2
kind: fill
title: 解析状态码的类型
type: question
chapterId: network
order: 5
---

填整数类型：状态码需支持 100 到 599，最终存入 `u16`：

```rust
let code: u16 = "404".parse::<____>().unwrap();
assert_eq!(code, 404);
```
