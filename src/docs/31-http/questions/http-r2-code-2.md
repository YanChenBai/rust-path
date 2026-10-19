---
id: http-r2-code-2
kind: code
title: JSON 响应帧
type: question
chapterId: http
order: 7
---

实现 json_response(body: `&str`) -&gt; `String`，生成 HTTP/1.1 200 OK、Content-Type: application/json、Content-Length、Connection: close，使用 CRLF 和一个空行，随后原样 body。

```rust starter
fn json_response(body: &str) -> String {
    todo!()
}

fn main() {
    // 先完成上方函数，再提交边界测试。
}
```
