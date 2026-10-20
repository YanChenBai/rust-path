---
id: network-tcp
title: TCP 字节流与消息边界
subtitle: 成功读取不代表收到整条消息
minutes: 18
nativeRequired: true
type: lesson
chapterId: network
order: 0
advanced: true
---

## 先定义帧格式，再处理分片与错误。

TCP 提供可靠、有序的字节流，不保留应用 write 的调用边界。一次 read 可能只拿到部分内容，也可能一次读到多条消息的一部分；协议必须自己定义定长、分隔符或长度前缀。read_exact 适合已知长度的数据，但对方提前关闭时会返回错误，不能把未填满的缓冲区当成合法消息继续处理。

示例在 127.0.0.1 的端口零绑定监听器，让操作系统分配空闲端口，再用 local_addr 传给客户端。这样可以重复运行，也避免占用固定端口或依赖公网服务。这里发送四字节固定消息，服务端读取恰好四字节再回写；编程题进一步使用两字节大端长度前缀，并限制最大消息长度，避免由不可信长度直接分配无限内存。

连接、读取、写入与等待连接分别需要考虑超时。TcpListener 没有同样的读取超时接口，所以辅助函数用非阻塞 accept 加截止时间；每条已连接流设置读写超时，客户端使用 connect_timeout。最后无论客户端业务成功与否，都等待服务线程返回，避免遗留后台工作。这是本机有限教学交换，不把单次系统调用超时误当作完整协议的绝对总截止时间。

<CourseCallout>

真实服务还需要限制并发、总字节数与整体请求期限；TCP 本身不提供业务认证。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

把 payload 改成 UTF-8 字节，增加长度前缀；对超长输入先返回 InvalidInput。

</CourseCallout>

```rust playground id=network-tcp source=30-network/src/bin/network-tcp.rs

```
