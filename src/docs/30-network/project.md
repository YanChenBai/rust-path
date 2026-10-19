---
type: project
chapterId: network
id: network-project
title: 本机 HTTP 协议实验台
---

把线程、流读写、错误传播与 HTTP 响应组装为可重复的端到端交换。

## 验收要求

- 实现 local_http(body: `&str`) -&gt; `std::io::Result`&lt;`String`&gt;，返回包含状态行、头部与正文的完整响应
- 仅绑定 127.0.0.1:0，服务端接收一次 GET 后返回 HTTP/1.1 200 OK、正确 Content-Length 和 Connection: close
- 正文最多 1024 字节，超长返回 `Err`；请求头最多 4096 字节，响应读取有上限；连接/读写/accept 有超时，所有路径回收服务线程

```rust starter
fn local_http(body: &str) -> std::io::Result<String> {
    todo!()
}

fn main() -> std::io::Result<()> {
    println!("{}", local_http("你好")?);
    Ok(())
}
```
