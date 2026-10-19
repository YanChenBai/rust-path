---
id: match
title: match 模式匹配
subtitle: 完整地处理每一种可能
minutes: 8
type: lesson
chapterId: control
order: 2
---

## 把每一种情况，都安排妥当。

`match` 将一个值与多个模式依次比较，并运行第一个匹配的分支。=&gt; 左边是模式，右边是结果。编译器要求覆盖所有可能，_ 可匹配剩余情况。范围模式使用 ..=，多个模式使用 |。

<CourseCallout>

`match` 的各分支必须返回相同类型。通配模式通常放最后，否则后续模式可能无法到达。

</CourseCallout>

<LessonGuides lesson-id="match" />

## 亲手试一试

```rust playground id=match
fn main() {
    // 从上往下匹配分支；模式必须覆盖所有可能的输入。

    // 保存连续学习天数，用于匹配奖励档位。
    let streak = 3;

    // 保存匹配分支返回的标记，供后续输出。
    let badge = match streak {
        0 => "旅程即将开始",
        1..=2 => "初露锋芒",
        3..=6 => "渐入佳境",
        _ => "坚持的力量",
    };

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{badge}");
}
```

<CourseCallout title="给自己一个小挑战">

给 7 添加一个专属分支，再尝试输入 0 和 10。

</CourseCallout>
