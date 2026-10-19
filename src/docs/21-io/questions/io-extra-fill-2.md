---
id: io-extra-fill-2
kind: fill
title: 可靠写完配置
type: question
chapterId: io
order: 5
---

填 Write 的方法名，写入全部字节或返回错误：

```rust
use std::io::Write;
let mut bytes = Vec::new();
```

bytes.____(b"port=80\n").unwrap();

```rust
assert_eq!(bytes, b"port=80\n");
```
