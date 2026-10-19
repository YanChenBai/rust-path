---
type: guide
lessonId: bindings
index: 1
title: 遮蔽创建新绑定，不是修改类型
---

### 2. 遮蔽创建新绑定，不是修改类型

下面先把输入作为字符串借用，再通过解析创建新的整数绑定，最后在内层块用同名变量计算翻倍值。离开内层后，外层的数值仍为 30。遮蔽适合解析、清理等阶段转换，避免为同一概念不断发明新名称；`mut` 则适合累计、更新等同一状态的持续变化。两者可以配合，但不应把遮蔽理解成动态类型。

```rust runnable id=bindings-guide-1
fn main() {
    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes = " 30 ";

    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes: u32 = minutes.trim().parse().expect("固定示例应为整数");

    // 累计本次处理结果，后续断言会检查最终数值。
    let mut total = minutes;
    total += 15;

    {
        // 保存学习时长或时长序列，后续按分钟规则处理。
        let minutes = minutes * 2;

        // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
        assert_eq!(minutes, 60);

        // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
        println!("块内：{minutes}");
    }

    assert_eq!(minutes, 30);
    assert_eq!(total, 45);
    println!("块外：{minutes}，总计：{total}");
}
```
