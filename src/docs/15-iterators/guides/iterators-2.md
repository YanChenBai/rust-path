---
type: guide
lessonId: iterators
index: 2
title: iter、iter_mut 与 into_iter 看接收者
---

### 3. iter、iter_mut 与 into_iter 看接收者

对拥有的 `Vec` 调用 iter 借出共享引用，iter_mut 借出可变引用，into_iter 则拿走 `Vec` 并逐个产出拥有的元素。但不能概括为“into_iter 永远移动原集合”：对 &`Vec` 使用 IntoIterator 会得到借用元素。数组在 Rust 2024 中按值调用 into_iter 会产出拥有的元素；如果数组元素是 `String`，就要注意整个数组的移动。
