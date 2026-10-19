---
id: network-code
kind: code
title: 实现与边界
type: question
chapterId: network
order: 6
---

实现 tcp_echo(payload: &[`u8`]) -&gt; `std::io::Result`&lt;`Vec`&lt;`u8`&gt;&gt;：本机动态端口自启服务，双向两字节大端长度前缀，最多 1024 字节；超长输入返回 `Err`，处理空帧，设置连接/读写/accept 超时并 join 服务线程。

```rust starter
fn tcp_echo(payload: &[u8]) -> std::io::Result<Vec<u8>> {
    todo!()
}

fn main() -> std::io::Result<()> {
    assert_eq!(tcp_echo(b"hi")?, b"hi");
    Ok(())
}
```
