---
id: lifetime-structures
title: 携带引用的结构体
subtitle: 借用视图的存活范围不能超过数据所有者。
minutes: 16
type: lesson
chapterId: lifetimes
order: 1
---

## 借用视图的存活范围不能超过数据所有者。

结构体字段如果保存引用，通常要用生命周期参数说明它借用了多久。Excerpt&lt;'a&gt; 不拥有文本，它要求其中的 `&str` 在视图使用期间仍有效。标注不会把局部字符串搬到堆外，也不会延长它的存活时间；负责保存数据的仍是输入的所有者。

方法 `fn text(&self) -> &str` 中，输出省略生命周期通常与 self 的借用关联。若明确写成返回 &'a str，可以表达底层输入的关系，但应确认接口是否真的需要让返回值超出本次 self 借用。不要为了通过编译把所有引用都写成 'static；这通常把可用输入缩小为静态数据。

T: 'static 表示 T 不包含更短的借用，不表示值永不释放。拥有 `String` 的结构体经常满足这个约束，却仍会正常析构。先画所有者、借用视图和调用处的有效区间，再决定使用借用字段还是拥有字段。

<CourseCallout>

生命周期参数描述引用之间的关系，不是手工内存管理命令。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

把 source 放入内部作用域，试图在作用域外使用 Excerpt，解释编译器拒绝的位置。

</CourseCallout>

```rust playground id=lifetime-structures source=14-lifetimes/src/bin/lifetime-structures.rs

```
