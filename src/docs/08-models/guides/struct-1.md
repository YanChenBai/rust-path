---
type: guide
lessonId: struct
index: 1
title: 接收者决定方法需要的权限
---

### 2. 接收者决定方法需要的权限

示例的 new 不接收实例，用 `Learner::new` 调用；summary 使用 &self，只读取当前状态；practice 使用 `&mut self`，更新积分。调用方法时编译器通常会自动借用接收者，因此不必手写 `(&mut learner).practice(...)`。若方法接收 self，则调用可能消耗整个实例，适合完成后不再保留旧对象的转换。

```rust runnable id=struct-guide-1 source=08-models/src/bin/struct-guide-1.rs

```
