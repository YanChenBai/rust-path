---
id: io-extra-fill-1
kind: fill
title: 处理下一行前清空
type: question
chapterId: io
order: 4
assessment:
  answer: clear
  explanation: clear 将 String 长度设为 0，便于复用缓冲区，避免新行追加到旧文本。
  mode: exact
---

填 `String` 的方法名，防止 read_line 追加到旧内容：

```rust source=21-io/snippets/io-extra-fill-1-snippet-1.rs

```

line.____();

```rust source=21-io/snippets/io-extra-fill-1-snippet-2.rs

```
