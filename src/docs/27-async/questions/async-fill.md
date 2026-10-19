---
id: async-fill
kind: fill
title: 补全关键 API
type: question
chapterId: async
order: 3
assessment:
  answer: spawn_blocking
  explanation: 同步阻塞工作应移到阻塞线程池；已经开始的阻塞闭包不能靠 abort 强行停止。
  mode: fold
---

把有限的同步阻塞工作交给 Tokio 阻塞线程池应使用 `tokio::task::____`。
