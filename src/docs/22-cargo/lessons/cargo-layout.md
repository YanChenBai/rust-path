---
id: cargo-layout
title: Package、Crate、Module 与 Workspace
subtitle: 目录结构与语言边界各司其职
minutes: 18
nativeRequired: true
type: lesson
chapterId: cargo
order: 0
---

## 模块组织名字，crate 形成编译单元，package 提供构建清单。

package 由 Cargo.toml 描述，可以包含一个库 crate 和多个二进制 crate。常规布局中 src/lib.rs 是库根，src/`main`.rs 是默认二进制根，src/bin 下可以放其他二进制入口。crate 是编译与路径解析的重要边界，module 则在 crate 内组织命名空间；文件夹本身不会自动成为公开模块，需要 mod 声明把源文件接入模块树。

`pub` 控制项目在模块边界上的可见性，但让子项 `pub` 并不自动让整个访问路径公开。`pub`(crate) 可把接口限制在当前 crate；use 只为当前作用域引入路径，`pub` use 才能建立对外再导出。示例把内部模型保留在私有模块中，再从根导出一个受控函数，调用方不必依赖实现所在的位置。

workspace 管理多个 package 的协作，通常共享根锁文件和 target 目录，并可集中声明依赖版本，但每个成员仍需选择自己使用哪些依赖。虚拟 workspace 没有根 package，需要显式考虑 resolver；Rust 2024 package 对应的默认解析器是版本三。单文件学习运行器不能真的创建多成员工程，所以本课用可编译的内联模块演示路径，真实拆文件时再保留同样的可见性设计。

<CourseCallout>

crate:: 指当前 crate 根；二进制 crate 与同 package 的库 crate 也不是同一个 crate。

</CourseCallout>

## 亲手试一试

```rust playground id=cargo-layout
mod domain {
    pub(crate) struct Minutes(pub u32);
    pub fn doubled(value: u32) -> Option<u32> {
        // 保存当前步骤得到的值，后续通过接口检查或转换。
        let value = Minutes(value);
        value.0.checked_mul(2)
    }
}
pub use domain::doubled;

fn main() {
    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(crate::doubled(12), Some(24));
    assert_eq!(doubled(u32::MAX), None);
}
```

<CourseCallout title="给自己一个小挑战">

在独立练习目录拆出 lib.rs 和 `main`.rs，再用 `pub` use 维持调用路径。

</CourseCallout>
