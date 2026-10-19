---
id: ecosystem-choice
kind: choice
title: 辨析关键机制
options:
  - 库用 thiserror 定义错误，应用用 anyhow 添加上下文
  - serde 自动验证全部业务规则
  - tracing 不需订阅者就保证输出
  - reqwest 的 send 成功一定是 2xx
type: question
chapterId: ecosystem
order: 0
assessment:
  answer: 库用 thiserror 定义错误，应用用 anyhow 添加上下文
  explanation: 这是常见分工而非硬性限制；serde 负责数据模型，reqwest 负责 HTTP 客户端。
  mode: fold
---

哪种错误分工在应用中较常见？
