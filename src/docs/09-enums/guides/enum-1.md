---
type: guide
lessonId: enum
index: 1
title: 用 Option 区分不存在与存在空值
---

### 2. 用 Option 区分不存在与存在空值

`Option<T>` 有 `Some(T)` 和 `None` 两种变体。`Some("")` 表示确实提供了一个空文本，`None` 表示没有文本，两者往往有不同业务含义。示例使用自定义 State 跟踪任务状态，并以 `Option` 保存下一课名称；读取缺失时显式提供提示，不需要虚构一个特殊字符串当作“没有值”的哨兵。

```rust runnable id=enum-guide-1 source=09-enums/src/bin/enum-guide-1.rs

```
