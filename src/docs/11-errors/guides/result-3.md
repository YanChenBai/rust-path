---
type: guide
lessonId: result
index: 3
title: Option 与 Result 之间需要明确语义转换
mistake: expect 只是给 panic 添加说明，并不处理错误。不要把用户输入解析失败认定为“不可能发生”；只在已经证明的不变量处使用它。
---

### 4. Option 与 Result 之间需要明确语义转换

`Option` 的 ? 在 `None` 时提前返回 `None`，`Result` 的 ? 在 `Err` 时返回错误，两者不能在普通稳定代码中随意混用。要把缺失提升为错误，可以用 ok_or_else 生成原因；把错误转成 `Option` 则会丢失错误信息，必须确认这是有意为之。返回 () 的普通 `main` 不能直接传播 `Result`；可在内部函数传播并在 `main` 匹配，或让 `main` 返回兼容的 `Result`。
<CourseCallout title="容易混淆的地方">

expect 只是给 panic 添加说明，并不处理错误。不要把用户输入解析失败认定为“不可能发生”；只在已经证明的不变量处使用它。

</CourseCallout>
