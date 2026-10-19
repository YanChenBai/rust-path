---
type: guide
lessonId: functions
index: 1
title: 提前返回处理特例，尾表达式返回正常结果
---

### 2. 提前返回处理特例，尾表达式返回正常结果

示例先排除零分钟，再计算普通奖励；调用者从返回值继续累加，而不是从打印文本中反推数字。`return` 会退出当前函数，尾表达式则自然成为函数结果。整数参数实现 `Copy`，按值传入不会让调用者失去它们。可以把倍率改为零，或把分钟改为边界值，观察签名不变时业务约定如何变化。

```rust runnable id=functions-guide-1
// minutes 是输入的学习分钟数，返回按每分钟 2 XP 计算的奖励。
fn reward(minutes: u32, multiplier: u32) -> u32 {
    if minutes == 0 {
        return 0;
    }
    minutes * multiplier
}

fn report(name: &str, points: u32) -> String {
    format!("{name} 获得 {points} 分")
}

fn main() {
    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes = 25;
    let points = reward(minutes, 2);

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(reward(0, 2), 0);
    assert_eq!(points, 50);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{}，学习 {minutes} 分钟", report("小林", points));
}
```
