---
type: guide
lessonId: blocks
index: 1
title: 局部计算与所有权转移可以同时发生
---

### 2. 局部计算与所有权转移可以同时发生

示例在块内计算奖励上限，又在另一个块内构造报告并把 `String` 返回给外层。临时的 bonus 和 message 名称离开块后不可访问，但报告的数据并没有随名称消失，而是移动给 report。内层同名 base 只在内层生效，离开后外层仍为八十。可以给尾表达式加分号，观察错误如何直接指出结果类型改变。

```rust runnable id=blocks-guide-1 source=03-functions/src/bin/blocks-guide-1.rs

```
