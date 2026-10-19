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

```rust playground id=iterators source=15-iterators/src/bin/iterators.rs

```

<CourseCallout title="给自己一个小挑战">

把筛选条件改为至少 20 分钟，再把结果转换为双倍积分。

</CourseCallout>
