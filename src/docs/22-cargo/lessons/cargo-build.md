---
id: cargo-build
title: Feature、Profile 与锁文件
subtitle: 依赖解析和优化选项是不同维度
minutes: 18
nativeRequired: true
type: lesson
chapterId: cargo
order: 1
---

## 构建命令回答不同问题，不能互相替代。

cargo check 适合快速发现类型与借用错误，通常不生成最终可执行文件；cargo build 生成构建产物；cargo test 会编译并运行测试，还可能执行文档测试。它们成功所证明的内容不同，不能用 check 成功宣称业务行为正确。测试函数需要测试框架发现，而学习平台把断言追加进 `main`，因此平台评测中的 tests 不应再包一层 cfg(test)。

feature 是命名的条件编译与依赖能力开关，常见配置是默认功能、可选依赖和依赖自己的 feature。feature 通常按并集组合，应设计成可叠加能力，不宜用互斥开关模拟产品运行模式；--no-default-features 也不保证其他依赖路径不会重新启用某个功能。示例通过 cfg 选择分支，在没有声明额外 feature 的单文件运行器里使用默认路径。

profile 决定优化、调试信息、溢出检查等编译设置，--release 通常选择 release profile，但不会证明程序更正确。Cargo.lock 记录本次解析的精确依赖版本，--locked 要求锁文件无需更改，否则失败；--offline 则要求所需数据本地可用，二者不能混淆。应用与 workspace 常提交锁文件以便复现，复现仍依赖工具链、目标平台和环境，而非只有锁文件。

<CourseCallout>

在真实工程声明 [features] 后再使用 cfg(feature = "...")，避免意外配置警告。

</CourseCallout>

## 亲手试一试

```rust playground id=cargo-build
// 独立 Cargo 工程可在 Cargo.toml 中声明：
// [features]
// default = []
// compact = []
fn mode() -> &'static str {
    if cfg!(debug_assertions) {
        "debug"
    } else {
        "optimized"
    }
}

fn main() {
    // 保存这一阶段返回的结果，后续检查它的实际内容或成功状态。
    let result = 21u32.checked_mul(2);

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(result, Some(42));

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!(
        "模式：{}；验证：cargo check / cargo build / cargo test",
        mode()
    );
}
```

<CourseCallout title="给自己一个小挑战">

在临时工程依次执行 cargo check、cargo build、cargo test，记录它们生成和执行的内容。

</CourseCallout>
