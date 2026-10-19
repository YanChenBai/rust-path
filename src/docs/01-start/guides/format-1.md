---
type: guide
lessonId: format
index: 1
title: 显示形式不会修改原始值
---

### 2. 显示形式不会修改原始值

下面把同一个浮点值显示为两位小数，把整数补零为三位，并打印数组的调试形式。精度只控制这次展示，不会把 hours 本身截成两位小数。`format!` 使用相同格式语法但返回 `String`，适合组合报告后继续传递；`println!` 直接产生输出，通常返回单元值 ()，不能用它代替构造报告字符串。

```rust runnable id=format-guide-1 source=01-start/src/bin/format-guide-1.rs

```
