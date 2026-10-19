---
id: threads-r2-choice-2
kind: choice
title: 判断边界行为
options:
  - 永久等待
  - 自动创建 Sender
  - 返回无限个零
  - 结束
type: question
chapterId: threads
order: 1
assessment:
  answer: 结束
  explanation: 关闭通道是退出协议的一部分。
  mode: fold
---

所有 Sender 释放且消息排空后接收迭代怎样？
