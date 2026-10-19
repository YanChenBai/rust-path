---
id: tests
title: 为行为写测试
subtitle: 让每次修改都有底气
minutes: 8
type: lesson
chapterId: tests
order: 0
---

## 用一个断言，守住一个约定。

#[test] 标记测试函数，`assert_eq!` 比较实际值与预期值。测试应覆盖正常输入、边界和异常。实际项目使用 cargo test；下方示例通过主函数运行相同断言，章节编程题则使用真正的 Rust 测试程序判题。

<CourseCallout>

通过几个测试不代表程序绝对正确。尝试找出没有被覆盖的边界，例如空输入与溢出。

</CourseCallout>

<LessonGuides lesson-id="tests" />

## 亲手试一试

```rust playground id=tests
fn hours(minutes: u32) -> u32 {
    minutes / 60
}

#[test]
fn handles_zero() {
    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(hours(0), 0);
}

fn main() {
    // 断言检查实际结果；测试通过只说明这些输入满足预期。

    assert_eq!(hours(90), 1);
    assert_eq!(hours(0), 0);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("所有断言通过！");
}
```

<CourseCallout title="给自己一个小挑战">

增加一个断言，验证恰好 60 分钟时返回 1 小时。

</CourseCallout>
