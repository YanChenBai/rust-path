---
id: async-choice
kind: choice
title: 辨析关键机制
options:
  - 丢弃 JoinHandle 会分离任务
  - 丢弃 JoinHandle 必定立即取消任务
  - await 必定启动一个系统线程
  - abort 能强制终止已运行的阻塞闭包
type: question
chapterId: async
order: 0
---

关于 Tokio 的 JoinHandle，哪项正确？
