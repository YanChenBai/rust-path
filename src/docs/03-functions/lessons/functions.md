---
id: functions
title: 参数与返回值
subtitle: 给每一段逻辑一个名字
minutes: 8
type: lesson
chapterId: functions
order: 0
---

## 小函数，解决清晰的小问题。

函数使用 `fn` 声明，参数必须标注类型，-&gt; 指定返回类型。函数体末尾没有分号的表达式会成为返回值。也可以用 `return` 提前返回。调用函数时，传入的参数类型必须与声明一致。

<CourseCallout>

x + 1 是表达式，会产生值；x + 1; 是语句，不会作为尾表达式返回。

</CourseCallout>

<LessonGuides lesson-id="functions" />

## 亲手试一试

```rust playground id=functions
// minutes 是输入的学习分钟数，返回按每分钟 2 XP 计算的奖励。
fn reward(minutes: u32) -> u32 {
    if minutes == 0 {
        return 0;
    }
    minutes * 2
}

fn main() {
    // 函数签名约束参数和返回值，调用位置决定执行顺序。

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("奖励 {} XP", reward(25));
}
```

<CourseCallout title="给自己一个小挑战">

为函数增加一个 multiplier 参数，让不同难度获得不同积分。

</CourseCallout>
