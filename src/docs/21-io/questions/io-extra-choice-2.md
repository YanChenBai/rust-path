---
id: io-extra-choice-2
kind: choice
title: 追加缓冲区的陷阱
options:
  - '"b\n"'
  - '"a\nb\n"'
  - '"ab"'
  - '"a\n"'
type: question
chapterId: io
order: 2
assessment:
  answer: '"a\nb\n"'
  explanation: read_line 将包含换行的内容追加到现有 String；第二次调用前未 clear，所以两行都保留。
  mode: exact
---

```rust source=21-io/snippets/io-extra-choice-2-snippet-1.rs

```

`source.read_line(&mut line).unwrap();`
`source.read_line(&mut line).unwrap();`

```rust source=21-io/snippets/io-extra-choice-2-snippet-2.rs

```

输出什么？
