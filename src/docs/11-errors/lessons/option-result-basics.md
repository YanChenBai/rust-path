---
id: option-result-basics
title: Option：缺失不等于零
subtitle: Some 保存已有值，None 明确表示缺失
minutes: 16
type: lesson
chapterId: errors
order: 0
---

## Option 迫使调用者处理“没有找到”的可能。

查找一个下标时，结果可能是一个整数，也可能根本没有元素。如果随意返回 0，就无法区分“找到了零”和“没有找到”。`Option`&lt;T&gt; 用 `Some`(value) 保存找到的值，用 `None` 表示缺失。这里 T 暂时表示内部数据的类型，不需要先会定义泛型才能使用标准库提供的 `Option`。

`match` 可以显式处理两个分支：`Some`(n) 中的 n 是取出来的值，`None` 分支安排缺失时的行为。没有证明一定存在时，不要用 unwrap 强行取出。数组或切片的 get 返回 `Option`&lt;&T&gt;，因此访问可能不存在的位置不必让整个程序 panic。借用符号的细节在后续使用中逐步熟悉，核心是不要把缺失偷偷当作正常数值。

当失败还需要说明原因时，应该改用 `Result`&lt;T,E&gt;，下一节会单独讲解。此处先把“缺失是正常分支”建立起来；map、and_then 和与 `Result` 的相互转换，留到闭包章节之后再系统处理，避免一次把容器、闭包和错误传播全部混在一起。

<CourseCallout>

`Some`(0) 是一个存在的零，`None` 是不存在；两者在业务上可以完全不同。

</CourseCallout>

## 亲手试一试

```rust playground id=option-result-basics
fn main() {
    // 准备待处理的输入序列，后续会读取其中的元素并验证计算结果。
    let values = [0, 25];
    for index in [0, 1, 2] {
        // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
        match values.get(index) {
            Some(value) => println!("找到：{value}"),
            None => println!("没有这个位置"),
        }
    }

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(values.get(0), Some(&0));
    assert_eq!(values.get(2), None);
}
```

<CourseCallout title="给自己一个小挑战">

把下标改为 0、1 和 2，预测每种输入会得到 `Some` 还是 `None`。

</CourseCallout>
