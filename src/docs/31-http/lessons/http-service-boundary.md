---
id: http-service-boundary
title: 请求、响应与资源边界
subtitle: 协议解析、业务逻辑与网络传输分别验证。
minutes: 16
type: lesson
chapterId: http
order: 2
---

## 协议解析、业务逻辑与网络传输分别验证。

HTTP 客户端负责构造请求、设置超时、检查状态并读取响应。收到响应并不等于业务成功，404 和 500 也可能正常完成网络传输。reqwest 的 error_for_status 可将失败状态转换为错误；响应体还需要按约定解析，不能见到文本就默认是 JSON。

服务端需要明确方法、路径、请求体大小和响应格式，路由只负责把请求交给业务函数。GET 应读取资源，改变状态通常使用 POST 等方法。返回 404 表示资源未找到，405 表示方法不支持；不要把所有失败都伪装成状态 200 的成功响应。

本节保留一个可重复验证的纯路由函数，与前面本机 TCP、HTTP 和 reqwest 示例配套。它是 HTTP 服务的业务边界，不冒充完整协议解析器：生产服务还需框架处理连接、header、分块传输、超时与并发。复杂项目应把这层函数作为可直接测试的核心，再接入真实传输。

<CourseCallout>

Content-Length 按字节计算，中文响应不能用字符数代替。

</CourseCallout>

## 亲手试一试

```rust playground id=http-service-boundary source=31-http/src/bin/http-service-boundary.rs

```

<CourseCallout title="给自己一个小挑战">

为路由函数增加不支持方法的 405 分支，并写对应测试。

</CourseCallout>
