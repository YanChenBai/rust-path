---
id: shutdown-r2-choice-2
kind: choice
title: 判断边界行为
options:
  - 永远等待
  - Some(0)
  - panic
  - None
type: question
chapterId: shutdown
order: 1
---

所有发送端释放且队列排空后 recv 返回什么？
