---
type: guide
lessonId: result
index: 1
title: 问号在当前函数中提前返回错误
---

### 2. 问号在当前函数中提前返回错误

示例先 trim，再解析整数；map_err 把解析错误转换成携带上下文的 `String`，? 在成功时取出 `u32`，在失败时立即返回 `Err`，后面的范围检查就不执行。可以把它理解成匹配 `Ok` 后继续、匹配 `Err` 后返回；`Result` 的 ? 还支持通过 From 转换为函数声明的错误类型，但不会自动给任意两个错误类型建立转换。

```rust runnable id=result-guide-1 source=11-errors/src/bin/result-guide-1.rs

```
