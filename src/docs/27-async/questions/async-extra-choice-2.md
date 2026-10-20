---
id: async-extra-choice-2
kind: choice
title: 顺序等待批次
options:
  - '5'
  - '6'
  - '10'
  - 无法编译：block_on 不返回计算结果
type: question
chapterId: async
order: 2
assessment:
  answer: '10'
  explanation: block_on 驱动 async 块完成，两个 await 分别得到 4 和 6，相加为 10；这段代码是顺序等待。
  mode: fold
---

`async fn double(n: u32) -> u32 { n * 2 }`

```rust source=27-async/snippets/async-extra-choice-2-snippet-1.rs

```

输出什么？
