---
id: generic-structures
title: 泛型结构与最小约束
subtitle: 类型参数复用结构，trait 边界声明操作所需的能力。
minutes: 16
type: lesson
chapterId: generics
order: 1
---

## 类型参数复用结构，trait 边界声明操作所需的能力。

泛型结构体把某个字段的类型留给调用方。Slot&lt;`i32`&gt; 与 Slot&lt;`String`&gt; 是不同的具体类型，但共享一套结构定义。`impl`&lt;T&gt; Slot&lt;T&gt; 中的 T 是实现块自己的参数，声明后才能在方法签名与函数体里使用它，不是自动继承某个全局名称。

只有真正需要的操作才添加边界。把值放进容器或返回引用不需要 `Clone`；格式化为调试文本才需要 `Debug`。把所有方法都放在 `impl`&lt;T: `Clone`&gt; 里会让本来不复制数据的操作也拒绝非 `Clone` 类型，限制应尽可能贴近需要它的方法。

示例中的 get 返回借用，into_inner 消费容器并转移值。两个接口的差别由 &self 与 self 表达。使用 `String` 测试能够暴露对 `Copy` 的无意依赖，不能只在整数上验证一个声称通用的泛型接口。

<CourseCallout>

泛型是编译期的类型抽象，不允许在函数里对未知类型做未声明的操作。

</CourseCallout>

## 亲手试一试

```rust playground id=generic-structures
struct Slot<T> {
    value: T,
}

impl<T> Slot<T> {
    fn get(&self) -> &T {
        &self.value
    }
    fn into_inner(self) -> T {
        self.value
    }
}

fn main() {
    // 把拥有值放入泛型容器，分别观察借用读取与消费取出。
    let slot = Slot {
        value: String::from("Rust"),
    };
    // 读取只借用，取出则消费整个容器。
    assert_eq!(slot.get(), "Rust");
    assert_eq!(slot.into_inner(), "Rust");
}
```

<CourseCallout title="给自己一个小挑战">

增加一个接收 &`mut` self 的 replace 方法，返回旧值而不要求 `Clone`。

</CourseCallout>
