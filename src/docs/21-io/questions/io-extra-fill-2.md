---
id: io-extra-fill-2
kind: fill
title: 可靠写完配置
type: question
chapterId: io
order: 5
assessment:
  answer: write_all
  explanation: write 可能只写入一部分字节，write_all 重复写入直到全部完成或返回错误。
  mode: exact
---

填 Write 的方法名，写入全部字节或返回错误：

```rust source=21-io/snippets/io-extra-fill-2-snippet-1.rs

```

bytes.____(b"port=80\n").unwrap();

```rust source=21-io/snippets/io-extra-fill-2-snippet-2.rs

```
