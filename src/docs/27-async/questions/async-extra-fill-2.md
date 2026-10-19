---
id: async-extra-fill-2
kind: fill
title: 同步入口驱动 Future
type: question
chapterId: async
order: 5
---

填运行时方法名：
`async` `fn` minutes() -&gt; `u32` { 25 }

```rust
let rt = tokio::runtime::Runtime::new().unwrap();
assert_eq!(rt.____(minutes()), 25);
```
