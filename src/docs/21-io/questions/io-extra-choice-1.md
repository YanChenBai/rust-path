---
id: io-extra-choice-1
kind: choice
title: 读取内存配置流
options:
  - '["port=80"]'
  - '["port=80\r", ""]'
  - '["port=80", ""]'
  - '["port=80", "", ""]'
type: question
chapterId: io
order: 1
assessment:
  answer: '["port=80", ""]'
  explanation: BufRead::lines 去掉 CRLF 或 LF；两个换行之间形成一个空行，最终换行后不再额外产生一行。
  mode: exact
---

```rust source=21-io/snippets/io-extra-choice-1-snippet-1.rs

```

输出什么？
