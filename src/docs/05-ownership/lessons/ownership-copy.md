---
id: ownership-copy
title: Copy、Clone 与作用域
subtitle: 赋值是否保留原绑定，取决于类型的所有权语义。
minutes: 16
type: lesson
chapterId: ownership
order: 1
---

## 赋值是否保留原绑定，取决于类型的所有权语义。

Rust 的值有负责清理它的所有者。把 `String` 按值赋给新绑定，通常转移它的管理责任，原绑定随后不能继续读取。这避免两位所有者对同一分配重复释放。移动不是承诺立刻复制堆数据，而是语言层面的所有权转移。

整数等 `Copy` 类型可通过隐式复制继续使用原值。`Copy` 要求类型满足可按位复制的约束，不能拥有需要独立析构的资源。`Clone` 是显式行为，可能分配、复制或只增加引用计数，成本应看具体类型，不能把 `clone` 当成所有借用报错的默认修复。

作用域结束时拥有的资源会被清理。示例克隆字符串形成两个独立所有者，再消费其中一个，另一个仍可使用。后面借用章会介绍如何在不复制的情况下临时读取；此时先把“传值可能消耗所有者”判断清楚。

<CourseCallout>

整数赋值可复制，不代表所有值都能在赋值后继续使用。

</CourseCallout>

## 亲手试一试

```rust playground id=ownership-copy
fn main() {
    // 从固定文本创建拥有存储的字符串，后续操作以这个值为输入。
    let first = String::from("Rust");
    // 显式创建独立副本，而不是让两个绑定共同负责同一分配。
    let second = first.clone();

    // 主动释放这个值或守卫，观察资源存活与访问范围的变化。
    drop(second);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{first}");

    // 保存当前解析或运算得到的数值，后续继续执行业务规则。
    let n = 7;

    // 整数实现 Copy，赋值复制数值，原绑定 n 仍可继续使用。
    let copy = n;

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(n + copy, 14);
}
```

<CourseCallout title="给自己一个小挑战">

移除 `clone` 并尝试再次打印 first，读懂 moved value 诊断。

</CourseCallout>
