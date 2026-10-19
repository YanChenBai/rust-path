---
id: shutdown
title: 异步取消、背压与优雅退出
source: https://tokio.rs/tokio/tutorial/channels
dependencies:
  - tokio
icon: '28'
nativeRequired: true
stage: 资源与并发
type: chapter
---

生产者比消费者快时，需要一个明确的容量边界。
