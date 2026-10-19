---
id: strings-r2-choice-3
kind: choice
title: 选择合适接口
options:
  - String 且必须复制
  - char
  - '&str'
  - '&mut String'
type: question
chapterId: strings
order: 2
assessment:
  answer: '&str'
  explanation: '&str 可以借用不同来源的文本。'
  mode: fold
---

只读文本函数通常优先接收什么？
