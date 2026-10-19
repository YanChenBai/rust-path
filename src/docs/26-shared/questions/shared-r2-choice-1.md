---
id: shared-r2-choice-1
kind: choice
title: 理解关键机制
options:
  - 不会
  - 总会
  - 只对 Vec 会
  - 等同 Mutex
type: question
chapterId: shared
order: 0
assessment:
  answer: 不会
  explanation: Arc 只同步引用计数。
  mode: fold
---

Arc 是否自动同步 T 内部的可变访问？
