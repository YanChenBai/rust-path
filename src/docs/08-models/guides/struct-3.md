---
type: guide
lessonId: struct
index: 3
title: 调试输出与业务显示分工
mistake: 可变方法需要可变访问权，实例通常必须绑定为 mut；但只读方法不应为方便而接收 &mut self，否则会无谓限制调用方的借用。
---

### 4. 调试输出与业务显示分工

`derive(Debug)` 让结构体可以用调试格式查看字段，适合排查内部状态；面向用户的报告可由方法生成，或另行实现 `Display`。示例用 saturating_add 将溢出饱和在上限，这是明确选择的业务行为，并不是所有积分系统都应该如此。如果超限应报错，应改用 checked_add 和 `Result`，而不是让一种便利写法暗中决定产品规则。
<CourseCallout title="容易混淆的地方">

可变方法需要可变访问权，实例通常必须绑定为 `mut`；但只读方法不应为方便而接收 `&mut self`，否则会无谓限制调用方的借用。

</CourseCallout>
