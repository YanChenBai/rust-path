---
type: guide
lessonId: types
index: 1
title: 计算顺序、单位与安全转换
---

### 2. 计算顺序、单位与安全转换

整数除法向零截断，所以 95 / 60 得到 1，之后再转成浮点也找不回小数。示例先转换，再相除，同时用余数得到不足一小时的分钟。checked_add 在溢出时返回 `None`，try_from 在目标类型装不下时返回 `Err`。这些写法把数值边界变成显式分支，比依赖 as 截断或某种构建模式的溢出行为更适合输入校验。

```rust runnable id=types-guide-1 source=02-variables/src/bin/types-guide-1.rs

```
