---
id: error-design
title: 保留错误上下文与缺失语义
subtitle: None 与 Err 表达不同事实，不应无意丢弃原因。
minutes: 16
type: lesson
chapterId: combinators
order: 1
---

## None 与 Err 表达不同事实，不应无意丢弃原因。

配置项不存在可以是正常情况，配置项存在但格式错误则是另一种情况。`Option<Result<T,E>>` 同时表达二者，transpose 可转换为 `Result<Option<T>,E>`，使外层流程可以用 ? 传播错误，同时保留“未配置”的状态。

业务错误应携带调用者需要的信息，例如行号、字段名和失败类别。map_err 转换错误，ok_or_else 把缺失提升为错误；反过来调用 ok 会丢失错误原因，应只在明确忽略失败的场景使用。库通常返回结构化错误，应用边界再组织面向用户的说明。

示例把 `Option<&str>` 解析成 `Result<Option<u32>, ParseIntError>`。没有输入返回 `Ok(None)`，非法输入返回 `Err`。之后的练习把每行错误加上行号，并要求首次错误立即终止，避免悄悄把不合法数据当作零。

<CourseCallout>

缺失、非法和合法的零是三个可能不同的业务状态。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

为解析结果增加范围校验，并保持缺失仍为 `Ok(None)`。

</CourseCallout>

```rust playground id=error-design source=16-combinators/src/bin/error-design.rs

```
