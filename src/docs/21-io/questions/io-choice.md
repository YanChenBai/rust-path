---
id: io-choice
kind: choice
title: 辨析关键机制
options:
  - write_all 会尝试写完全部字节
  - write 总会写完全部字节
  - flush 等同于掉电持久化
  - 忽略 lines 中的错误最可靠
type: question
chapterId: io
order: 0
assessment:
  answer: write_all 会尝试写完全部字节
  explanation: write 允许短写；write_all 会重试直到完成或遇到错误。
  mode: fold
---

关于 Write，下列哪项正确？
