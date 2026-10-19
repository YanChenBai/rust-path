---
type: guide
lessonId: move
index: 1
title: 按值传参和返回值也会移动
---

### 2. 按值传参和返回值也会移动

示例把原文本移动给 decorate，再把修改后的 `String` 返回并绑定为 decorated。backup 是在移动之前显式 `clone` 得到的独立文本，所以不会随着追加内容而变化。这个流程适合流水线逐步接管数据；如果函数只读取字符数，接收 `&str` 更合适，无需为了还能访问原变量而做一次昂贵的复制。

```rust runnable id=move-guide-1 source=05-ownership/src/bin/move-guide-1.rs

```
