---
id: struct
title: 结构体与方法
subtitle: 把相关的数据放在一起
minutes: 8
type: lesson
chapterId: models
order: 0
---

## 从一组变量，到一个完整的概念。

`struct` 将相关字段组合成自定义类型。`impl` 块为类型定义方法，&self 借用当前实例，&`mut` self 允许修改实例。通过 点号 访问字段与调用方法。

<CourseCallout>

构建实例时必须提供所有字段。需要调试打印时，可以使用 #[derive(`Debug`)]。

</CourseCallout>

<LessonGuides lesson-id="struct" />

## 亲手试一试

```rust playground id=struct
#[derive(Debug)]

struct Learner {
    name: String,
    xp: u32,
}

impl Learner {
    fn practice(&mut self) {
        self.xp += 25;
    }
}

fn main() {
    // 字段组成一个有意义的整体，方法通过 self 访问当前实例。

    // 创建学习者实例，把名字和进度放进同一个结构体。
    let mut learner = Learner {
        name: String::from("小林"),
        xp: 0,
    };
    learner.practice();

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{} 获得了 {} XP", learner.name, learner.xp);
}
```

<CourseCallout title="给自己一个小挑战">

新增 completed: `bool` 字段，并添加一个完成学习的方法。

</CourseCallout>
