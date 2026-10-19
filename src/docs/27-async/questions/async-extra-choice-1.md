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
---

```rust
use std::cell::Cell;
let count = Cell::new(0);
let job = async { count.set(5); };
```

drop(job);

```rust
println!("{}", count.get()); 输出什么？
```
