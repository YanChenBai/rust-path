---
id: loops
title: 循环：for、while 与 loop
subtitle: 把重复交给代码
minutes: 8
type: lesson
chapterId: control
order: 1
---

## 一次编写，多次执行。

`for` 遍历迭代器，1..=5 包含 1 到 5，1..5 不包含 5。`while` 在条件成立时重复，`loop` 则持续循环，直到 break。continue 会跳过本轮剩余语句。break 还可以给 `loop` 返回一个值。

<CourseCallout>

优先使用 `for` 遍历集合或范围，减少下标越界与忘记更新条件的问题。

</CourseCallout>

<LessonGuides lesson-id="loops" />

## 亲手试一试

```rust playground id=loops
fn main() {
    // 注意循环范围是否包含右端点，避免多执行或少执行一次。

    // 累计本次处理结果，后续断言会检查最终数值。
    let mut total = 0;
    for day in 1..=5 {
        total += day;
    }

    // 保存剩余轮数，循环每轮减少它以保证能够结束。
    let mut countdown = 3;
    while countdown > 0 {
        countdown -= 1;
    }

    // 接收 loop 中 break 携带的结果。
    let reward = loop {
        break total * 10;
    };

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("总计 {total}，奖励 {reward} XP");
}
```

<CourseCallout title="给自己一个小挑战">

把范围改为 1..=10，只累加其中的偶数。

</CourseCallout>
