---
type: guide
lessonId: iterators
index: 1
title: 从元素类型推导闭包参数
---

### 2. 从元素类型推导闭包参数

values.iter() 产生 &`u32`，copied 将这些共享引用指向的 `Copy` 值复制为 `u32`。filter 的谓词接收元素的引用，因此这里是 &`u32`，要用 *value 比较；后面的 map 接收元素本身，因此是 `u32`。collect 需要知道目标集合类型，例如可显式声明 `Vec`&lt;`u32`&gt;。本例用 next 取首项，再用 extend 消费余项，通过转换次数观察管道的推进。

```rust runnable id=iterators-guide-1
fn main() {
    // 准备待处理的输入序列，后续会读取其中的元素并验证计算结果。
    let values = vec![10_u32, 30, 5, 45];

    // 记录闭包或表达式实际执行次数，用于验证执行时机。
    let mut calls = 0;
    let scores = {
        let mut pipeline =
            values
                .iter()
                .copied()
                .filter(|value| *value >= 25)
                .map(|value| {
                    calls += 1;
                    value * 2
                });

        // 保存原始拥有值，后续用它对比移动和显式克隆的区别。
        let first = pipeline.next();

        // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
        assert_eq!(first, Some(60));

        // 保存这一阶段返回的结果，后续检查它的实际内容或成功状态。
        let mut result = vec![first.expect("已有首项")];
        result.extend(pipeline);
        result
    };
    assert_eq!(calls, 2);
    assert_eq!(scores, vec![60, 90]);

    // 累计本次处理结果，后续断言会检查最终数值。
    let total: u32 = scores.iter().sum();
    assert_eq!(values.len(), 4);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{scores:?}，总计 {total}，转换 {calls} 次");
}
```
