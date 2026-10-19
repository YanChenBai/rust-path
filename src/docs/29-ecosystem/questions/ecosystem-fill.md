---
id: ecosystem-fill
kind: fill
title: 补全关键 API
type: question
chapterId: ecosystem
order: 3
assessment:
  answer: try_parse_from
  explanation: clap 的 try_parse_from 返回错误，适合断言；parse 出错通常会结束进程。
  mode: fold
---

测试 clap 参数解析且避免错误时退出进程，应调用 Parser `trait` 的 ____。
