---
id: network-udp
title: UDP 数据报与来源地址
subtitle: 保留消息边界，但不保证到达
minutes: 18
nativeRequired: true
type: lesson
chapterId: network
order: 1
advanced: true
---

## 数据报的成功发送不等于对方成功处理。

UDP 以数据报为单位通信，recv_from 同时返回收到的长度与来源地址，服务端可把响应发送回这个地址。它不保证送达、顺序或去重，应用如果需要可靠性，就要设计序号、确认与重试。不能因为回环测试稳定成功，就推断真实网络永远不会丢包；测试证明的是本机协议代码的基本行为。

接收缓冲区过小可能导致截断或平台相关错误，不能把缓冲区长度自动当成完整消息长度。教学示例限定四字节消息并提供足够缓冲区，只比较返回长度以内的内容，避免把后面的零字节当作消息的一部分。接收来源也属于协议输入，本机客户端要校验响应来自刚绑定的服务端地址，而不是接受任意数据报。

示例的服务端和客户端都绑定动态回环端口，并对两端设置读写超时；即使工作线程未收到数据，recv_from 也会在错误路径退出。主线程保存交换结果后再 join 服务线程，确保重复运行时资源已回收。UDP 没有 TCP 那样的连接握手，connect 的意义主要是选择默认对端与过滤来源，不代表已经证明远端应用存在，更不等于建立可靠会话。

<CourseCallout>

不要用大于实际收到长度的切片解析响应；生产协议需要明确最大数据报大小。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

把四字节内容替换成中文，确认比较的是字节；增加来源地址断言。

</CourseCallout>

```rust playground id=network-udp source=30-network/src/bin/network-udp.rs

```
