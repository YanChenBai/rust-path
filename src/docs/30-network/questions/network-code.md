---
id: network-code
kind: code
title: 实现与边界
type: question
chapterId: network
order: 6
assessment:
  explanation: 回环动态端口隔离测试；两字节大端长度前缀定义消息边界，连接、读写和 accept 都有时间上界。
  answerSource: 30-network/src/bin/network-code.rs?region=answer
  testsSource: 30-network/src/bin/network-code.rs?region=tests
---

实现 `tcp_echo(payload: &[u8]) -> std::io::Result<Vec<u8>>`：本机动态端口自启服务，双向两字节大端长度前缀，最多 1024 字节；超长输入返回 `Err`，处理空帧，设置连接/读写/accept 超时并 join 服务线程。

```rust starter source=30-network/starters/network-code-starter.rs

```
