---
type: guide
lessonId: move
index: 3
title: 部分移动与资源设计
mistake: 把 original 传给接收 String 的函数后，再打印 original 会报移动错误。mut 不会让已移动的值恢复可读，引用才表达暂时使用而不接管。
---

### 4. 部分移动与资源设计

从一个没有自定义 Drop 的结构体中取走 `String` 字段，可能只移动该字段，其他未移动字段仍可单独使用，但整个实例不能再作为完整值使用。这叫部分移动。若类型实现了 Drop，直接移走其非 `Copy` 字段通常会被禁止，因为析构还需要完整对象。遇到移动错误，应先决定调用者是否需要保留数据，再选择借用、转移后返回或确有需求的 `clone`。
<CourseCallout title="容易混淆的地方">

把 original 传给接收 `String` 的函数后，再打印 original 会报移动错误。`mut` 不会让已移动的值恢复可读，引用才表达暂时使用而不接管。

</CourseCallout>
