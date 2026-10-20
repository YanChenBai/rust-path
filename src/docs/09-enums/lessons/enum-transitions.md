---
id: enum-transitions
title: 让非法状态难以表达
subtitle: 变体可以携带不同类型的数据，用 match 定义合法转换。
minutes: 16
type: lesson
chapterId: enums
order: 1
---

## 变体可以携带不同类型的数据，用 match 定义合法转换。

多个 `bool` 容易组合出互相矛盾的状态，例如同时“运行中”和“已完成”。枚举用变体表达互斥的情况，每个变体只携带该状态需要的数据。Pending 不需要结果，Done 可以携带完成数量，Failed 则携带错误原因。

`match` 会检查穷尽性。新增变体后，原有匹配可能要求更新，这让状态变化能够传导到依赖它的代码。下划线分支虽方便，却可能掩盖新增状态：重要业务转换通常应逐一处理，而不是用一个默认分支悄悄接受未知情况。

匹配拥有值可能移动变体内部的数据，匹配引用则借用它。示例接收 &State，只查看状态不销毁它。先掌握这个显式版本，再学习 `if` `let` 与 `let else` 的简化形式；它们适合关注少数模式，但不自动替代完整状态机的规则。

<CourseCallout>

枚举表达有哪些状态，`match` 表达每种状态如何处理。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

给状态增加 `Failed(String)`，更新显示函数并确认原对象仍可使用。

</CourseCallout>

```rust playground id=enum-transitions source=09-enums/src/bin/enum-transitions.rs

```
