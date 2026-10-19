---
id: network-extra-code
kind: code
title: 解析简化 HTTP 状态行
type: question
chapterId: network
order: 7
---

实现 status_code(response: `&str`) -&gt; `Option`&lt;`u16`&gt;，仅解析 lines().next() 首行，不连接服务器。首行用 split_ascii_whitespace 分词：版本必须是 HTTP/1.0 或 HTTP/1.1；第二词必须恰好 3 个 ASCII 数字且数值 100..=599；原因短语可缺省，后续词与行忽略。空串、首行空白、版本或状态码非法均返回 `None`。

```rust starter
fn status_code(response: &str) -> Option<u16> {
    todo!()
}

fn main() {
    println!("{:?}", status_code("HTTP/1.1 200 OK\r\n\r\n"));
}
```
