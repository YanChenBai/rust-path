---
id: database-http-capstone
title: 串联本机 HTTP 与文件数据库
subtitle: 从请求到落盘，再重新打开读取
minutes: 30
nativeRequired: true
dependencies:
  - rusqlite
  - serde_json
type: lesson
chapterId: database
order: 2
---

## 网络成功、业务校验、事务提交与持久化读取要分别验证。

这个示例把前面学到的线程、TCP、HTTP、JSON、参数绑定与文件路径串成一个完整闭环：本机客户端发送一条学习记录，服务端校验后写入 SQLite 文件，响应完成后再重新打开数据库检查数据。重新打开仍能读到数据，才能证明结果并非只存在某个内存变量里。

示例只接受一条有限长度的 POST /minutes 请求，使用动态回环端口和读写超时，不依赖公网。请求头与正文按长度读取，不能假设一次 read 就拿到完整消息。数据库写入使用绑定参数；成功提交后才发送 201，非法输入返回 400。服务端结束后等待线程退出，再检查文件并清理临时目录。

这是用于观察端到端边界的有限协议实验，不是通用 HTTP 框架。它主动限定请求大小、单连接、Content-Length 和连接关闭，不支持分块请求、长连接、认证或高并发。生产服务应使用成熟框架处理完整协议，再复用这里分离出来的校验和数据库逻辑。专项题仍先验收事务的全部成功或整体回滚，随后可以把自己的实现替换进本示例。

<CourseCallout>

HTTP 已响应不等于数据库已提交；持久化验收要在连接关闭后重新读取。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

在副本中把客户端 minutes 改为 0，预测 400 响应与零条持久化记录，再修改断言验证。

</CourseCallout>

```rust playground id=database-http-capstone source=32-database/src/bin/database-http-capstone.rs

```
