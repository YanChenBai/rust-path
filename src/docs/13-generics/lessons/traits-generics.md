---
id: traits-generics
title: 泛型与能力约束
subtitle: 类型参数不是任意操作的通行证
minutes: 18
type: lesson
chapterId: generics
order: 0
advanced: true
---

## 用 trait 描述算法需要的最小能力。

泛型把类型差异留给调用者，但函数体仍然必须证明每一个操作合法。类型参数 T 没有自动获得比较、复制或打印能力，需要用 `trait` 边界声明需求。示例只要求 Ord，因为算法比较的是借用，不复制元素，也不需要 `Clone`。返回 `Option` 可以自然表达空切片，避免为了取第一个值而产生越界恐慌。

编译器通常为使用到的具体类型生成对应实现，这个过程称为单态化。它允许静态分发与后续优化，也可能增加生成代码体积。where 子句与尖括号里的边界表达同样的约束，复杂签名用 where 更容易阅读；关联类型则适合表达一个实现所确定的输出类型，例如 `Iterator::Item`。

注意 Ord 要求全序，而浮点数一般只实现 PartialOrd，因为 NaN 不能按普通数值规则排序。不要为让示例编译就随意添加 `Copy`、`Clone` 或 'static，这会缩小可接受的数据范围。先从函数体实际使用的能力推导边界，再用字符串等非 `Copy` 类型检验接口是否过度约束。

<CourseCallout>

`impl` Trait 参数适合单个抽象输入；多个参数必须同型时，显式命名类型参数。

</CourseCallout>

## 亲手试一试

```rust playground id=traits-generics source=13-generics/src/bin/traits-generics.rs

```

<CourseCallout title="给自己一个小挑战">

用 `String` 切片调用 greatest，再解释为何无需 `Clone`；增加空切片断言。

</CourseCallout>
