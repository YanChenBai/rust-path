---
id: trait-conversions
title: From、TryFrom 与 newtype
subtitle: 不会失败与可能失败的转换，应使用不同接口。
minutes: 16
type: lesson
chapterId: traits
order: 1
---

## 不会失败与可能失败的转换，应使用不同接口。

From&lt;T&gt; 表达有明确语义且不会失败的转换，TryFrom&lt;T&gt; 用 `Result` 表达可能失败。与随意 as 转换相比，TryFrom 能让超范围输入显式失败。实现 From 后通常得到相应 Into 用法，实现 TryFrom 后通常可使用 TryInto。

newtype 用一个本地类型包装已有值，为相同底层表示增加业务含义，例如 `Minutes(u32)` 与 `Bytes(u32)` 不应随便互换。构造处验证范围，后续代码就能依赖已成立的不变量。字段可见性与模块配合，能避免外部绕过验证。

AsRef 适合廉价获得某种借用视图，不承担通用解析或校验。不要把 From 实现为会 panic 的字符串解析；这会隐藏失败可能。示例对标准整数做受检转换，再给自定义时长实现 TryFrom，明确区分表示范围与业务范围。

<CourseCallout>

转换是否可能失败，比写法长短更重要。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

把允许范围改为 1..=180，为 0、180、181 写断言。

</CourseCallout>

```rust playground id=trait-conversions source=12-traits/src/bin/trait-conversions.rs

```
