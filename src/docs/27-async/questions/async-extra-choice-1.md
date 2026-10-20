---
id: async-extra-choice-1
kind: choice
title: 未执行的后台导入
options:
  - '5'
  - '0'
  - 无法确定：Future 会自动在线程上运行
  - 无法编译：async 块必须立刻 await
type: question
chapterId: async
order: 1
assessment:
  answer: '0'
  explanation: 创建 async 块只产生 Future；没有轮询或 await 就 drop，块体不会执行。
  mode: fold
---

```rust source=27-async/snippets/async-extra-choice-1-snippet-1.rs

```

drop(job);

```rust source=27-async/snippets/async-extra-choice-1-snippet-2.rs

```

输出什么？
