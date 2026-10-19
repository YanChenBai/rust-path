---
type: guide
lessonId: types
index: 1
title: 计算顺序、单位与安全转换
---

### 2. 计算顺序、单位与安全转换

整数除法向零截断，所以 95 / 60 得到 1，之后再转成浮点也找不回小数。示例先转换，再相除，同时用余数得到不足一小时的分钟。checked_add 在溢出时返回 `None`，try_from 在目标类型装不下时返回 `Err`。这些写法把数值边界变成显式分支，比依赖 as 截断或某种构建模式的溢出行为更适合输入校验。

```rust runnable id=types-guide-1
fn main() {
    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes: u32 = 95;
    let hours = f64::from(minutes) / 60.0;
    let summary: (u32, u32) = (minutes / 60, minutes % 60);
    let checkpoints: [u32; 3] = [0, 60, 120];

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(summary, (1, 35));
    assert_eq!(255_u8.checked_add(1), None);
    assert!(u8::try_from(300_u16).is_err());

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{hours:.3} 小时，{summary:?}，{}", checkpoints[1]);
}
```
