---
id: io-extra-choice-1
kind: choice
title: 读取内存配置流
options:
  - '["port=80"]'
  - '["port=80\r", ""]'
  - '["port=80", ""]'
  - '["port=80", "", ""]'
type: question
chapterId: io
order: 1
---

```rust
use std::io::{BufRead, Cursor};
let lines: Vec<_> = Cursor::new("port=80\r\n\n").lines().collect::<Result<_, _>>().unwrap();
println!("{lines:?}"); 输出什么？
```
