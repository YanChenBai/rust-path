---
id: network-extra-choice-1
kind: choice
title: 定位响应首行
options:
  - HTTP/1.1
  - '404'
  - Not
  - '0'
type: question
chapterId: network
order: 1
---

```rust
let response = "HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n";
let status = response.lines().next().unwrap().split_whitespace().nth(1).unwrap();
println!("{status}"); 输出什么？
```
