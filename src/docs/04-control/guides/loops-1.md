---
type: guide
lessonId: loops
index: 1
title: 逐轮观察 continue 与 break
---

### 2. 逐轮观察 continue 与 break

示例用包含式范围走过零至六，奇数遇到 continue 后跳过加法，偶数累加为十二。随后 `while` 从三递减到零，条件在每轮开始前检查。`loop` 没有隐含停止条件，break total * 2 将二十四作为循环表达式结果。普通 `for` 与 `while` 不能用带数值的 break 来返回业务值，应在循环外保存结果或改用合适的 `loop`。

```rust runnable id=loops-guide-1
fn main() {
    // 累计本次处理结果，后续断言会检查最终数值。
    let mut total = 0;
    for number in 0..=6 {
        if number % 2 != 0 {
            continue;
        }
        total += number;
    }
    let mut remaining = 3;
    while remaining > 0 {
        remaining -= 1;
    }

    // 接收 loop 中 break 携带的结果。
    let reward = loop {
        break total * 2;
    };

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!((total, remaining, reward), (12, 0, 24));
    assert_eq!((3..3).count(), 0);
    assert_eq!((3..=3).count(), 1);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("总计 {total}，奖励 {reward}");
}
```
