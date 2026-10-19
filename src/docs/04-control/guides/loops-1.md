---
type: guide
lessonId: loops
index: 1
title: 逐轮观察 continue 与 break
---

### 2. 逐轮观察 continue 与 break

示例用包含式范围走过零至六，奇数遇到 continue 后跳过加法，偶数累加为十二。随后 `while` 从三递减到零，条件在每轮开始前检查。`loop` 没有隐含停止条件，break total * 2 将二十四作为循环表达式结果。普通 `for` 与 `while` 不能用带数值的 break 来返回业务值，应在循环外保存结果或改用合适的 `loop`。

```rust runnable id=loops-guide-1 source=04-control/src/bin/loops-guide-1.rs

```
