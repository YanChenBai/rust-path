---
id: vec
title: Vec 与 HashMap
subtitle: 从一份数据，到一组数据
minutes: 8
type: lesson
chapterId: collections
order: 0
---

## 让数据，拥有合适的容器。

`Vec<T>` 是可增长的同类型集合，使用 push 追加元素。get 返回 `Option`，能安全处理下标越界。`HashMap<K, V>` 将键关联到值，entry(...).or_insert(...) 可以插入默认值并返回可变引用。

<CourseCallout>

vec[index] 越界会 panic，get(index) 则返回 `None`。根据数据是否可信选择访问方式。

</CourseCallout>

<LessonGuides lesson-id="vec" />

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

再加入一条记录，统计总学习时间。

</CourseCallout>

```rust playground id=vec source=10-collections/src/bin/vec.rs

```
