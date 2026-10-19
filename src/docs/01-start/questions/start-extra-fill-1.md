---
id: start-extra-fill-1
kind: fill
title: 构造签到文案
type: question
chapterId: start
order: 4
---

只填宏名，不含 !，让 label 保存文本而不立即打印：

```rust
let label = ____!("签到：{}", "Ada");
assert_eq!(label, "签到：Ada");
```
