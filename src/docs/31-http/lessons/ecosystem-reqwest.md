---
id: ecosystem-reqwest
title: reqwest 与本机 JSON 服务
subtitle: 配置超时、状态检查和解析边界
minutes: 18
nativeRequired: true
dependencies:
  - tokio
  - serde
  - serde_json
  - anyhow
  - reqwest
type: lesson
chapterId: http
order: 1
advanced: true
---

## HTTP 客户端处理传输细节，应用仍需定义成功条件。

reqwest 的异步 Client 可以复用连接池，并把请求发送、状态处理和正文解析分为独立步骤。send 成功只代表收到了响应，不保证状态是成功，error_for_status 可以把四百和五百段状态转换成错误。json::&lt;T&gt;() 继续解析正文，解析成功之后仍可能需要领域校验。示例复用同一个 Client，并显式配置连接超时和请求总超时。

本机服务用 Tokio 的 TcpListener 绑定回环动态端口，不请求公网，也不依赖用户提前启动其他程序。服务端用 timeout 包住 accept 和整次读写，限制请求头长度，并返回带 Content-Length 的 JSON。客户端显式禁用代理，避免机器上的代理配置把回环请求转发出去；服务端与客户端分别有时间上界，即使错误路径也会等待服务任务结束。

运行器提供 reqwest 0.12，启用 json 与 rustls-tls、关闭默认功能；这里使用异步接口，不要求未启用的 blocking 功能。Tokio 提供运行时，serde 派生目标结构，serde_json 生成服务端正文。真实应用还要考虑重试是否幂等、正文大小限制与认证，本课的固定小响应只验证本机交换。不要把完整 HTTP 客户端与手写的一次性教学服务混为同等成熟度。

<CourseCallout>

参考文档：https://docs.rs/reqwest/0.12/reqwest/`struct`.ClientBuilder.html；本例不使用 blocking feature。

</CourseCallout>

## 亲手试一试

```rust playground id=ecosystem-reqwest source=31-http/src/bin/ecosystem-reqwest.rs

```

<CourseCallout title="给自己一个小挑战">

把状态改成 500，观察 error_for_status；恢复后用字段类型不匹配验证 JSON 错误。

</CourseCallout>
