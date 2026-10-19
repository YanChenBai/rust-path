---
id: iterators
title: 迭代器与闭包
subtitle: 清晰地描述数据怎么变化
minutes: 8
type: lesson
chapterId: iterators
order: 0
---

## 筛选、转换、收集，一气呵成。

iter() 借用集合元素，into_iter() 消耗集合，iter_mut() 提供可变引用。filter 筛选元素，map 转换元素，collect 收集结果，sum 汇总数值。|x| ... 是一个闭包。

<CourseCallout>

迭代器是惰性的。没有 collect、sum 等消费操作，转换通常不会真正执行。

</CourseCallout>

<LessonGuides lesson-id="iterators" />

## 亲手试一试

```rust playground id=iterators
fn main() {
    // 迭代器描述处理步骤，消费操作才会驱动这条处理链。

    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes = vec![10, 30, 5, 45];

    // 构建筛选后的处理流程；迭代器通常在消费时才执行。
    let focused: Vec<u32> = minutes
        .iter()
        .copied()
        .filter(|n| *n >= 25)
        .map(|n| n * 2)
        .collect();

    // 累计本次处理结果，后续断言会检查最终数值。
    let total: u32 = focused.iter().sum();

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("积分：{focused:?}，总计 {total}");
}
```

<CourseCallout title="给自己一个小挑战">

把筛选条件改为至少 20 分钟，再把结果转换为双倍积分。

</CourseCallout>
