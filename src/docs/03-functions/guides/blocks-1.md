---
type: guide
lessonId: blocks
index: 1
title: 局部计算与所有权转移可以同时发生
---

### 2. 局部计算与所有权转移可以同时发生

示例在块内计算奖励上限，又在另一个块内构造报告并把 `String` 返回给外层。临时的 bonus 和 message 名称离开块后不可访问，但报告的数据并没有随名称消失，而是移动给 report。内层同名 base 只在内层生效，离开后外层仍为八十。可以给尾表达式加分号，观察错误如何直接指出结果类型改变。

```rust runnable id=blocks-guide-1
fn main() {
    // 保存基础数值，内层计算在它的基础上增加奖励。
    let base: u32 = 80;
    let points = {
        // 保存本次额外奖励，只在当前块作用域内可见。
        let bonus = 35;
        (base + bonus).min(100)
    };

    // 准备结果字符串，按规则逐步追加内容。
    let report = {
        // 保存本次消息内容或分支选出的提示。
        let message = format!("最终积分：{points}");
        message
    };
    {
        // 保存基础数值，内层计算在它的基础上增加奖励。
        let base = 5;

        // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
        assert_eq!(base, 5);
    }
    assert_eq!(base, 80);
    assert_eq!(points, 100);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{report}");
}
```
