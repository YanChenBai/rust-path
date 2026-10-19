---
type: guide
lessonId: bindings
index: 3
title: mut 不能绕过借用规则
mistake: let mut value = 1; value = "一"; 不是遮蔽，会类型不匹配。要切换表示，应使用新的 let，并确认旧名称被隐藏后是否仍容易理解。
---

### 4. mut 不能绕过借用规则

拥有可变绑定只是申请可变借用的前提之一，并不允许同时通过任意别名修改数据。`let mut` text = `String::new()` 可以调用 push_str，但如果一个共享引用还将在后面被使用，就不能先修改 text。反过来，可变引用绑定本身不一定要写 `mut`，仍能修改其指向的数据；需要重新绑定这个引用时，才涉及绑定自身的可变性。
<CourseCallout title="容易混淆的地方">

`let mut` value = 1; value = "一"; 不是遮蔽，会类型不匹配。要切换表示，应使用新的 `let`，并确认旧名称被隐藏后是否仍容易理解。

</CourseCallout>
