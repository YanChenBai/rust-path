---
id: ecosystem-errors-cli
title: thiserror、anyhow、clap 与 tracing
subtitle: 错误供程序判断，事件帮助定位
minutes: 18
nativeRequired: true
dependencies:
  - anyhow
  - thiserror
  - clap
  - tracing
type: lesson
chapterId: ecosystem
order: 1
advanced: true
---

## 库边界保留类型，应用边界添加操作上下文。

thiserror 可以为错误枚举派生 `Display` 和 `std::error::Error`，让调用方按变体匹配领域失败。anyhow 适合应用层组合不同来源的错误并附加 Context，不要求每次都设计一个巨大的总错误枚举。这是常见职责分配，不是语言限制；重要的是保留错误来源和可行动信息，不把类型化错误过早转成 `String`。

clap 的 Parser 派生把命令行参数映射到结构体。parse 适合真实入口，因为帮助或无效输入可能结束进程；try_parse_from 则返回 `Result`，可以用固定参数数组测试，不依赖启动进程时实际传了什么。解析器只能校验声明过的语法和类型，业务范围仍需独立函数验证。这样命令行、JSON 与库调用可以复用同一个领域规则。

tracing 提供事件与 span，字段应描述重要操作和上下文，避免记录敏感令牌。只有核心 tracing 依赖而没有安装合适订阅者时，事件通常不会显示，不能把没有日志误判为代码未执行。本课允许的依赖不含 tracing-subscriber，所以示例只发出结构化事件并用返回值验证业务；真实应用可在允许扩展依赖时再选择输出与采集方案。异步代码还应避免跨 `await` 持有进入 span 的守卫。

<CourseCallout>

参考文档：https://docs.rs/anyhow/、https://docs.rs/thiserror/、https://docs.rs/clap/、https://docs.rs/tracing/。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

传入 --minutes 0 和未知参数，区分 clap 语法错误与业务枚举错误。

</CourseCallout>

```rust playground id=ecosystem-errors-cli source=29-ecosystem/src/bin/ecosystem-errors-cli.rs

```
