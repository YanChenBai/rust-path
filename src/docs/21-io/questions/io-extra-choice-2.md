---
id: io-extra-choice-2
kind: choice
title: 追加缓冲区的陷阱
options:
  - '"b\n"'
  - '"a\nb\n"'
  - '"ab"'
  - '"a\n"'
type: question
chapterId: io
order: 2
---

```rust
use std::io::{BufRead, Cursor};
let mut source = Cursor::new("a\nb\n");
let mut line = String::new();
```

source.read_line(&`mut` line).unwrap();
source.read_line(&`mut` line).unwrap();

```rust
println!("{line:?}"); 输出什么？
```
