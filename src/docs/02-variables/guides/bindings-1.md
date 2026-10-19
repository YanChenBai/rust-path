---
type: guide
lessonId: bindings
index: 1
title: 遮蔽创建新绑定，不是修改类型
---

### 2. 遮蔽创建新绑定，不是修改类型

下面先把输入作为字符串借用，再通过解析创建新的整数绑定，最后在内层块用同名变量计算翻倍值。离开内层后，外层的数值仍为 30。遮蔽适合解析、清理等阶段转换，避免为同一概念不断发明新名称；`mut` 则适合累计、更新等同一状态的持续变化。两者可以配合，但不应把遮蔽理解成动态类型。

```rust runnable id=bindings-guide-1 source=02-variables/src/bin/bindings-guide-1.rs

```
