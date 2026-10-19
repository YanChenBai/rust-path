---
id: http-r2-choice-1
kind: choice
title: 理解关键机制
options:
  - 已收到响应，但资源未找到
  - 一定断网
  - 一定超时
  - 响应体一定空
type: question
chapterId: http
order: 0
assessment:
  answer: 已收到响应，但资源未找到
  explanation: 传输完成不等于业务成功。
  mode: fold
---

HTTP 收到 404，说明什么？
