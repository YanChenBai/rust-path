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
assessment:
  answer: 丢弃 JoinHandle 会分离任务
  explanation: 丢弃普通 Future 会停止继续轮询；已 spawn 的任务需要显式 abort 并等待结束。
  mode: fold
---

关于 Tokio 的 JoinHandle，哪项正确？
