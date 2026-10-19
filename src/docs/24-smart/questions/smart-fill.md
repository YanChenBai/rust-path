---
id: smart-fill
kind: fill
title: 补全关键 API
type: question
chapterId: smart
order: 3
assessment:
  answer: try_borrow_mut
  explanation: try_borrow_mut 用 Result 表达借用冲突，borrow_mut 在冲突时 panic。
  mode: fold
---

补全无恐慌的独占借用方法：cell.____()，返回 `Result<RefMut<_>, _>`。
