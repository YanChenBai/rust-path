---
type: guide
lessonId: iterators
index: 1
title: 从元素类型推导闭包参数
---

### 2. 从元素类型推导闭包参数

values.iter() 产生 &`u32`，copied 将这些共享引用指向的 `Copy` 值复制为 `u32`。filter 的谓词接收元素的引用，因此这里是 &`u32`，要用 *value 比较；后面的 map 接收元素本身，因此是 `u32`。collect 需要知道目标集合类型，例如可显式声明 `Vec<u32>`。本例用 next 取首项，再用 extend 消费余项，通过转换次数观察管道的推进。

```rust runnable id=iterators-guide-1 source=15-iterators/src/bin/iterators-guide-1.rs

```
