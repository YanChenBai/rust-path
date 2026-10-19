---
id: types
title: 元组与数组：组合多个值
subtitle: 把单个值组合成有明确形状的数据
minutes: 8
type: lesson
chapterId: variables
order: 2
---

## 类型，是数据与程序之间的约定。

元组可以按位置组合不同类型，例如 (姓名, 分钟, 是否完成)，用 .0、.1、.2 读取对应位置，也可以用 `let` (name, minutes, done) = record 解构。数组 [T; N] 的元素类型相同且长度固定，使用 [10, 20, 30] 创建，下标从 0 开始。元组表达几个不同含义的值，数组表达一组同类值，不要只因为都能装多个值就混为一谈。

<CourseCallout>

数组 `len`() 返回元素数量，不是最后一个下标；三个元素的合法下标是 0、1、2。

</CourseCallout>

<LessonGuides lesson-id="types" />

## 亲手试一试

```rust playground id=types
fn main() {
    // 把名称、分钟数和完成状态组合为一个元组。
    let record = ("小林", 25u32, false);

    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes = [10, 20, 30];

    // 元组按位置读取不同含义的数据，数组下标读取同类元素。
    println!("姓名：{}，分钟：{}", record.0, record.1);
    println!("数组调试形式：{minutes:?}");

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(minutes[1], 20);
    assert_eq!(minutes.len(), 3);
    let (name, duration, done) = record;
    println!("{name} / {duration} / {done}");
}
```

<CourseCallout title="给自己一个小挑战">

修改元组的姓名和数组内容，预测 .1、[1] 与 `len`() 各自得到什么。

</CourseCallout>
