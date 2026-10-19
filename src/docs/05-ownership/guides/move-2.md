---
type: guide
lessonId: move
index: 2
title: Copy 与 Clone 的成本和含义不同
---

### 3. Copy 与 Clone 的成本和含义不同

整数、布尔值以及共享引用等实现 `Copy` 的类型，在赋值或传参时可隐式复制，原绑定仍有效。`String` 和 `Vec` 不实现 `Copy`，因为按位复制其管理信息会破坏独占拥有关系。`Clone` 是显式的复制能力，具体成本由类型决定；`String::clone` 通常复制文本并分配独立缓冲区，而某些共享指针的 `clone` 只是增加引用计数，不能一概称为深拷贝。
