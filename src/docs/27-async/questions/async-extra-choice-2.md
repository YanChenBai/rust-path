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
---

`async` `fn` double(n: `u32`) -&gt; `u32` { n * 2 }

```rust
let rt = tokio::runtime::Runtime::new().unwrap();
let total = rt.block_on(async { double(2).await + double(3).await });
println!("{total}"); 输出什么？
```
