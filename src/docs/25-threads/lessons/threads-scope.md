---
id: threads-scope
title: 作用域线程与借用数据
subtitle: 并发任务的生命周期边界也可以由作用域表达。
minutes: 16
type: lesson
chapterId: threads
order: 1
---

## 并发任务的生命周期边界也可以由作用域表达。

普通 `thread::spawn` 的闭包通常要求 static，因为新线程可能比创建它的函数活得更久。`move` 只能移动捕获值，不能让被移动的短引用突然变成长引用。`thread::scope` 约束线程在作用域返回前结束，因此允许在线程中借用作用域外的数据。

消息传递把数据所有权从发送方交给接收方，接收之后由新所有者负责。克隆 Sender 会增加发送端数量，只有所有发送端释放后，接收方的迭代才会自然结束。常见挂起来自忘记释放主线程仍保留的一份 Sender，而不是通道本身神秘失效。

并发程序应明确等待与错误传播。join 返回线程结果，恐慌会成为 `Err`；不要创建线程后立刻读共享结果却不等待。示例用作用域线程借用两个切片，子线程各自计算局部结果，不需要共享可变计数器，通常比一开始就引入锁更容易验证。

<CourseCallout>

优先考虑拆分数据与消息传递；只有确实需要共同修改时再引入共享状态。

</CourseCallout>

## 亲手试一试

```rust playground id=threads-scope
fn main() {
    // 准备待处理的输入序列，后续会读取其中的元素并验证计算结果。
    let values = [1, 2, 3, 4];

    // 累计本次处理结果，后续断言会检查最终数值。
    let total = std::thread::scope(|scope| {
        // 启动或保存左半段的计算，避免直接共用可变累计值。
        let left = scope.spawn(|| values[..2].iter().sum::<i32>());

        // 启动或保存右半段的计算，最终与左半段结果合并。
        let right = scope.spawn(|| values[2..].iter().sum::<i32>());

        // 等待并发工作结束，再读取它产生的结果或处理线程恐慌。
        left.join().unwrap() + right.join().unwrap()
    });

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(total, 10);
}
```

<CourseCallout title="给自己一个小挑战">

把每段求和改为返回 `Result`，练习区分 join 失败与业务失败。

</CourseCallout>
