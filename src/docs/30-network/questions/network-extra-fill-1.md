---
id: network-extra-fill-1
kind: fill
title: 从响应中只取首行
type: question
chapterId: network
order: 4
---

填迭代器方法名：

```rust
let response = "HTTP/1.1 200 OK\r\nX-Test: 1\r\n";
let first = response.lines().____().unwrap();
assert_eq!(first, "HTTP/1.1 200 OK");
```
