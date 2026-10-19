---
type: guide
lessonId: functions
index: 1
title: 提前返回处理特例，尾表达式返回正常结果
---

### 2. 提前返回处理特例，尾表达式返回正常结果

示例先排除零分钟，再计算普通奖励；调用者从返回值继续累加，而不是从打印文本中反推数字。`return` 会退出当前函数，尾表达式则自然成为函数结果。整数参数实现 `Copy`，按值传入不会让调用者失去它们。可以把倍率改为零，或把分钟改为边界值，观察签名不变时业务约定如何变化。

```rust runnable id=functions-guide-1 source=03-functions/src/bin/functions-guide-1.rs

```
