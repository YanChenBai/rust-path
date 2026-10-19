---
id: stdlib-iter-time
title: 惰性迭代与时间测量
subtitle: 消费发生在哪里，成本就发生在哪里
minutes: 18
type: lesson
chapterId: iterators
order: 1
---

## 迭代器控制数据流，Instant 测量经过时间。

iter 借用集合元素，iter_mut 提供独占借用，into_iter 对拥有的集合通常会消费并移出元素。map 和 filter 只构造新的迭代器，直到 collect、sum、fold 或 `for` 真正消费才执行处理。闭包接收到的引用层级取决于迭代器的 Item 与适配器签名，尤其 filter 的谓词借用当前元素，不要仅靠反复加星号来试错。

示例先 copied 把 &`u32` 变成 `u32`，再转换到 `u64` 后做乘法，避免窄整数先溢出。把过滤和映射融合成流水线不意味着任何情况下都会比显式循环快；清晰的类型和正确的边界比缩短代码更重要。需要提前停止并传播错误时，可以选择 try_fold 或 collect 到 `Result`，而不是把错误默默 filter 掉。

Duration 表示时间长度，Instant 用于测量单调经过时间，SystemTime 表达墙上时钟并可能受校时影响而回拨。不要在测试中断言某段工作恰好耗费几毫秒，调度与机器负载会引入变化。示例只验证算出的业务总量，用 elapsed 展示观测值；生产计时还需要重复采样并避免把打印和编译成本混入目标操作。

<CourseCallout>

Instant 不能直接持久化为日历时间；需要时间戳时使用 SystemTime 并处理错误。

</CourseCallout>

## 亲手试一试

```rust playground id=stdlib-iter-time
use std::time::{Duration, Instant, SystemTime};

fn main() {
    // 记录单调时钟起点，用于测量已经过去的时长。
    let start = Instant::now();

    // 准备待处理的输入序列，后续会读取其中的元素并验证计算结果。
    let values = [0u32, 3, 7];

    // 累计本次处理结果，后续断言会检查最终数值。
    let total: u64 = values
        .iter()
        .copied()
        .filter(|n| *n > 0)
        .map(|n| u64::from(n) * 60)
        .sum();

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(total, 600);

    // 指定允许的耗时预算，避免把时间控制写成隐含常量。
    let budget = Duration::from_secs(1);

    // 取得用于记录的时间值，与单调耗时测量的用途不同。
    let timestamp = SystemTime::now().duration_since(SystemTime::UNIX_EPOCH);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!(
        "耗时 {:?}，预算 {:?}，时间戳 {:?}",
        start.elapsed(),
        budget,
        timestamp
    );
}
```

<CourseCallout title="给自己一个小挑战">

把求和改为 try_fold 并使用 checked_add，说明错误为何不能用 filter_map 丢弃。

</CourseCallout>
