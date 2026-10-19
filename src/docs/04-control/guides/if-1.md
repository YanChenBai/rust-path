---
type: guide
lessonId: if
index: 1
title: if 产生值，分支必须有兼容类型
---

### 2. if 产生值，分支必须有兼容类型

把 `if` 放在赋值右侧时，选中分支的尾表达式就是整个 `if` 的值。下面两个价格分支都产生 `u32`，之后可以直接相乘。若一个分支返回整数，另一个返回字符串，编译器无法给结果确定统一类型。更准确地说，各分支需要能归并到兼容类型；共享引用可能发生类型强制转换，而提前 `return` 等不返回的分支也能参与这种检查。

```rust runnable id=if-guide-1 source=04-control/src/bin/if-guide-1.rs

```
