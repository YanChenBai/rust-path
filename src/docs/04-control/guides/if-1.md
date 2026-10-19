---
type: guide
lessonId: if
index: 1
title: if 产生值，分支必须有兼容类型
---

### 2. if 产生值，分支必须有兼容类型

把 `if` 放在赋值右侧时，选中分支的尾表达式就是整个 `if` 的值。下面两个价格分支都产生 `u32`，之后可以直接相乘。若一个分支返回整数，另一个返回字符串，编译器无法给结果确定统一类型。更准确地说，各分支需要能归并到兼容类型；共享引用可能发生类型强制转换，而提前 `return` 等不返回的分支也能参与这种检查。

```rust runnable id=if-guide-1
fn main() {
    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes: u32 = 60;
    let is_member = true;
    let rate: u32 = if is_member { 8 } else { 10 };
    let label = if minutes >= 90 {
        "长时专注"
    } else if minutes >= 60 {
        "达成一小时"
    } else {
        "短时练习"
    };

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(label, "达成一小时");
    assert_eq!(rate * 2, 16);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{label}，两小时费用：{}", rate * 2);
}
```
