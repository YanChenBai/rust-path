---
id: network-extra-fill-2
kind: fill
title: 解析状态码的类型
type: question
chapterId: network
order: 5
assessment:
  answer: u16
  explanation: u16 可容纳 100..=599，u8 最大值 255 不够。
  mode: exact
---

填整数类型：状态码需支持 100 到 599，最终存入 `u16`：

```rust source=30-network/snippets/network-extra-fill-2-snippet-1.rs

```
