---
type: guide
lessonId: match
index: 1
title: 按结构拆开值，同时保留原数据
---

### 2. 按结构拆开值，同时保留原数据

这里匹配 &request，`Some` 中的 text 由模式匹配的自动引用绑定规则推断为 &`String`，因此只是借用文本。空白文本先被守卫拦下，其他 `Some` 走第二个分支，`None` 走第三个分支。匹配之后仍能打印 request。如果改为按值匹配并取出内部 `String`，就会发生移动，不能再把原来的 `Option` 当作完整值使用。

```rust runnable id=match-guide-1 source=04-control/src/bin/match-guide-1.rs

```
