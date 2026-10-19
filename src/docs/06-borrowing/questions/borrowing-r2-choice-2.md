---
id: borrowing-r2-choice-2
kind: choice
title: 判断边界行为
options:
  - 引用的地址
  - n 的副本
  - 类型本身
  - n 的值
type: question
chapterId: borrowing
order: 1
assessment:
  answer: n 的值
  explanation: 解引用访问被引用的数据。
  mode: fold
---

执行 `let p = &mut n; *p += 2;` 修改的是谁？
