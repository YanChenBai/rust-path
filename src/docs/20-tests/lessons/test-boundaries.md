---
id: test-boundaries
title: 用不变量选择测试输入
subtitle: 测试不是展示成功路径，而是主动寻找实现的漏洞。
minutes: 16
type: lesson
chapterId: tests
order: 1
---

## 测试不是展示成功路径，而是主动寻找实现的漏洞。

边界值来自需求中的比较和算术：低于阈值、恰好阈值、高于阈值，以及空集合、缺失和最大值。先写清不变量，例如转账前后总额不变、失败不修改输入，再选择能够推翻错误实现的例子。仅测试 happy path 容易把明显的 off-by-one 留到后面。

单元测试可以靠近实现并访问模块内部；集成测试通过公开接口验证组合行为；文档测试同时验证 API 示例。测试通常并行运行，不应依赖固定文件名、全局计数或另一项测试先执行。外部服务与当前时间应变成可控制的输入，而不是偷偷影响断言。

示例的 tests 模块由 cargo test 执行，`main` 中提供同样的边界断言以便直接运行。发生错误时，先读取失败输入和 expected/actual，再判断是需求、测试还是实现不对。不要为了绿色通过而删除揭示问题的断言。

<CourseCallout>

本页运行 `main`；工具栏选择 cargo test 才运行 #[test] 测试。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

把 fee 的 &gt;= 错改为 &gt;，观察恰好边界的测试如何发现问题。

</CourseCallout>

```rust playground id=test-boundaries source=20-tests/src/bin/test-boundaries.rs

```
