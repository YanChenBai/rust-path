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

`Vec`&lt;T&gt; 是可增长的同类型集合，使用 push 追加元素。get 返回 `Option`，能安全处理下标越界。`HashMap`&lt;K, V&gt; 将键关联到值，entry(...).or_insert(...) 可以插入默认值并返回可变引用。

<CourseCallout>

vec[index] 越界会 panic，get(index) 则返回 `None`。根据数据是否可信选择访问方式。

</CourseCallout>

<LessonGuides lesson-id="vec" />

## 亲手试一试

```rust playground id=vec
use std::collections::HashMap;

fn main() {
    // Vec 拥有元素；修改集合时要留意已有引用的有效范围。

    // 保存学习时长或时长序列，后续按分钟规则处理。
    let mut minutes = vec![20, 30, 15];
    minutes.push(45);

    // 按名称保存累计结果，缺失键需要显式安排初始值。
    let mut counts = HashMap::new();
    for value in &minutes {
        *counts.entry("总分钟").or_insert(0) += value;
    }

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{counts:?}");
}
```

<CourseCallout title="给自己一个小挑战">

再加入一条记录，统计总学习时间。

</CourseCallout>
