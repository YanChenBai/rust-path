---
id: io-extra-fill-1
kind: fill
title: 处理下一行前清空
type: question
chapterId: io
order: 4
---

填 `String` 的方法名，防止 read_line 追加到旧内容：

```rust
let mut line = String::from("旧内容");
```

line.____();

```rust
assert!(line.is_empty());
```
