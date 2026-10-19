---
type: guide
lessonId: struct
index: 1
title: 接收者决定方法需要的权限
---

### 2. 接收者决定方法需要的权限

示例的 new 不接收实例，用 `Learner::new` 调用；summary 使用 &self，只读取当前状态；practice 使用 &`mut` self，更新积分。调用方法时编译器通常会自动借用接收者，因此不必手写 (&`mut` learner).practice(...)。若方法接收 self，则调用可能消耗整个实例，适合完成后不再保留旧对象的转换。

```rust runnable id=struct-guide-1
#[derive(Debug)]

struct Learner {
    name: String,
    points: u32,
}

impl Learner {
    fn new(name: &str) -> Self {
        Self {
            name: name.to_owned(),
            points: 0,
        }
    }

    fn practice(&mut self, points: u32) {
        self.points = self.points.saturating_add(points);
    }

    fn summary(&self) -> String {
        format!("{}：{} 分", self.name, self.points)
    }
}

fn main() {
    // 创建学习者实例，把名字和进度放进同一个结构体。
    let mut learner = Learner::new("小林");
    learner.practice(25);

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(learner.points, 25);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{}，调试：{learner:?}", learner.summary());
}
```
