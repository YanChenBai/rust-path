---
id: shutdown-r2-choice-1
kind: choice
title: 理解关键机制
options:
  - 等待容量或返回关闭错误
  - 自动丢弃全部消息
  - 无限扩容
  - 阻塞整个运行时
type: question
chapterId: shutdown
order: 0
assessment:
  answer: 等待容量或返回关闭错误
  explanation: 异步等待让出执行机会。
  mode: fold
---

有界队列已满，`send().await` 通常怎样？
