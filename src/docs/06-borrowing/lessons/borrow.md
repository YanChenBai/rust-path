---
id: borrow
title: 引用、可变借用与切片
subtitle: 使用数据，不必拿走它
minutes: 8
type: lesson
chapterId: borrowing
order: 0
---

## 借用，是暂时的使用权。

&T 创建共享引用，&`mut` T 创建可变引用。对于重叠的使用范围，允许多个共享引用，或一个独占的可变引用。`&str` 是字符串切片，&[T] 是集合切片，它们都借用已有数据。

<CourseCallout>

`String::len` 返回字节数。统计 Unicode 字符数量可以用 chars().count()；这仍不同于用户眼中的字形簇数量。

</CourseCallout>

<LessonGuides lesson-id="borrow" />

## 亲手试一试

```rust playground id=borrow
// 通过可变借用修改调用者的 String，而不是创建修改后就丢弃的副本。
fn add_tag(name: &mut String) {
    // 把这一段文本追加到可变 String，已有内容不会被覆盖。
    name.push_str(" · Rust");
}

fn main() {
    // 借用只提供临时访问权；共享读取与独占修改不能同时存在。

    // 保存本次示例使用的名称文本，后面用于构造输出或比较。
    let mut name = String::from("小林");
    add_tag(&mut name);

    // 借用现有文本，不创建可增长的字符串容器。
    let borrowed: &str = &name;

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{borrowed}，{} 个字符", borrowed.chars().count());
}
```

<CourseCallout title="给自己一个小挑战">

把名字改成中文，对比 `len`() 与 chars().count()。

</CourseCallout>
