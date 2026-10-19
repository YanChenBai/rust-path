---
id: shared-r2-choice-2
kind: choice
title: 判断边界行为
options:
  - 每次读之后
  - 每秒自动
  - Arc 复制时
  - 守卫被 drop 时
type: question
chapterId: shared
order: 1
assessment:
  answer: 守卫被 drop 时
  explanation: RAII 控制解锁。
  mode: fold
---

锁守卫什么时候释放互斥访问？
