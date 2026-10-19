---
id: network-http
title: HTTP 是应用层协议
subtitle: 状态行、头部与正文需要一致
minutes: 18
nativeRequired: true
type: lesson
chapterId: http
order: 0
advanced: true
---

## 长度按字节计算，教学子集不能冒充完整服务器。

HTTP/1.1 请求由请求行、头部、空行和可选正文组成，响应以状态行开始。行结束符使用 CRLF，头部与正文之间是连续两个 CRLF。Content-Length 表示正文的字节数，中文字符的数量不能直接用来填这个字段。TCP 只运输这些字节，并不会替应用检查 HTTP 状态码或解析分块传输。

示例自启动一次性回环服务，仅接收一个无正文 GET 请求，限制请求头最多四千零九十六字节，然后返回固定 UTF-8 正文和 Connection: close。客户端读到服务端关闭后结束，并同时限制总响应字节数。网络读写与 accept 都有超时边界，不会因缺少公网环境失败；服务线程最终被回收，动态端口也随资源释放归还。

这个实现没有覆盖分块编码、持久连接、压缩、重定向、请求正文、TLS 或通用头部语法，所以只作为协议边界练习。实际应用应选择成熟 HTTP 客户端或服务框架，避免用字符串切割实现完整 HTTP。后续依赖课会用 reqwest 读取同样的本机响应，并用 status 检查与超时配置表达应用层成功条件。学习目标是理解层次和失败位置，而不是声称手写了生产服务器。

<CourseCallout>

HTTP 传输成功与 2xx 状态不同；客户端要明确是否把 4xx、5xx 视为错误。

</CourseCallout>

## 亲手试一试

```rust playground id=network-http source=31-http/src/bin/network-http.rs

```

<CourseCallout title="给自己一个小挑战">

把响应正文换成你好，确认 Content-Length 为 6；重复运行观察端口变化。

</CourseCallout>
