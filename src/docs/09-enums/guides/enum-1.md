---
type: guide
lessonId: enum
index: 1
title: 用 Option 区分不存在与存在空值
---

### 2. 用 Option 区分不存在与存在空值

`Option`&lt;T&gt; 有 `Some`(T) 和 `None` 两种变体。`Some`("") 表示确实提供了一个空文本，`None` 表示没有文本，两者往往有不同业务含义。示例使用自定义 State 跟踪任务状态，并以 `Option` 保存下一课名称；读取缺失时显式提供提示，不需要虚构一个特殊字符串当作“没有值”的哨兵。

```rust runnable id=enum-guide-1
enum State {
    Waiting,
    Learning { minutes: u32 },
    Done(String),
}

fn describe(state: &State) -> String {
    // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
    match state {
        State::Waiting => String::from("等待开始"),
        State::Learning { minutes } => format!("已学 {minutes} 分钟"),
        State::Done(title) => format!("完成 {title}"),
    }
}

fn main() {
    let states = [
        State::Waiting,
        State::Learning { minutes: 25 },
        State::Done(String::from("枚举")),
    ];
    for state in &states {
        // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
        println!("{}", describe(state));
    }

    // 构造带有数据的枚举变体，再通过模式匹配读取。
    let next: Option<&str> = None;

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(next.unwrap_or("全部完成"), "全部完成");
    assert_ne!(Some(""), next);
}
```
