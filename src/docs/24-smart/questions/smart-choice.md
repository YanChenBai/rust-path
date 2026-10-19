---
id: smart-choice
kind: choice
title: 辨析关键机制
options:
  - Weak 不增加强引用计数
  - Rc 可以直接跨线程共享写入
  - Weak 保证对象一直存活
  - clone Rc 深复制对象
type: question
chapterId: smart
order: 0
---

关于 Rc 与 Weak，哪项正确？
