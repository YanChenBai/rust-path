---
id: network-extra-choice-1
kind: choice
title: 定位响应首行
options:
  - HTTP/1.1
  - '404'
  - Not
  - '0'
type: question
chapterId: network
order: 1
assessment:
  answer: '404'
  explanation: next 取首行，split_whitespace 的第 0 词是版本，第 1 词是状态码。
  mode: fold
---

```rust source=30-network/snippets/network-extra-choice-1-snippet-1.rs

```
