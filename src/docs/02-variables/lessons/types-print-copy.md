---
id: types-print-copy
title: 哪些值能打印，哪些能复制
subtitle: 打印、比较、复制与长度是独立能力
minutes: 18
type: lesson
chapterId: variables
order: 7
---

## 可打印不代表可 Copy，可 clone 也不代表复制没有成本。

`println!`("{}", value) 使用面向显示的格式，数字、`bool`、char、`String` 和 `&str` 通常都支持。数组和 `Vec` 通常不能直接用 {}，观察结构应使用 {:?}，需要更易读的布局可用 {:#?}。这些能力在标准库中分别称为 `Display` 与 `Debug`，后面 Trait 章会解释如何给自定义类型增加它们。

`let` b = a; 对 `i32`、`bool`、char 等 `Copy` 类型通常复制值，因此 a 还能继续用。`String` 不实现 `Copy`，这样的赋值会移动所有权，原绑定不能继续使用；需要独立文本可显式写 a.`clone`()。复制不是所有值共有的 .`copy`() 方法，`Copy` 是一种类型能力。字符串切片 `&str` 的引用值可以 `Copy`，但并没有深复制其指向的文本。

打印一个普通 `String` 通常只读取它，并不会像按值传给消费函数一样拿走所有权。因此“打印后还能再打印”不能证明 `String` 实现了 `Copy`。数组只有元素也可 `Copy` 时才具有相应能力；包含 `String` 的数组不能因为外层是数组就自动按位复制。后面的所有权章会用编译失败的对比例子展开这一点。

<CourseCallout>

没有“所有值都能 `len`/`copy`/print”的规则。先识别类型，再确认具体能力。

</CourseCallout>

| 类型                               | 例子                   | {} 显示 | {:?} 调试 | `len`() 的含义                        | 复制方式                             |
| ---------------------------------- | ---------------------- | ------- | --------- | ------------------------------------- | ------------------------------------ |
| `i32` / `u32` / `f64`              | 3 / 25 / 2.5           | 支持    | 支持      | 没有 `len`()                          | `Copy`，赋值后原值仍可用             |
| `bool`                             | true                   | 支持    | 支持      | 没有 `len`()                          | `Copy`                               |
| char                               | '你'                   | 支持    | 支持      | 没有 `len`()；len_utf8() 是编码字节数 | `Copy`                               |
| `&str`                             | "你好"                 | 支持    | 支持      | UTF-8 字节数，此例为 6                | `Copy` 的是引用，不是深复制文本      |
| `String`                           | `String::from("你好")` | 支持    | 支持      | UTF-8 字节数，此例为 6                | 不是 `Copy`；`clone`() 创建独立文本  |
| [`i32`; 3]                         | [1, 2, 3]              | 不支持  | 支持      | 元素数，此例为 3                      | 元素可 `Copy`，因此此数组也可 `Copy` |
| `Vec`&lt;`i32`&gt;（集合章会介绍） | `vec!`[1, 2, 3]        | 不支持  | 支持      | 已有元素数                            | 不是 `Copy`；`clone`() 复制元素      |

## 亲手试一试

```rust playground id=types-print-copy
fn main() {
    // 保存当前计数，用于对比操作之前与之后的状态。
    let count = 3;

    // 复制整数值；整数实现 Copy，因此原绑定仍能使用。
    let another = count;

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("整数：{count}，副本：{another}");

    // 准备待处理的输入序列，后续会读取其中的元素并验证计算结果。
    let values = [1, 2, 3];
    println!("数组调试形式：{values:?}");

    // 从固定文本创建拥有存储的字符串，后续操作以这个值为输入。
    let text = String::from("你好");
    println!("{text}");
    println!("打印后还可使用：{text}");
    // String 没有 Copy；显式 clone 才得到独立副本。
    let mut copied = text.clone();
    copied.push('!');

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(text, "你好");
    assert_eq!(copied, "你好!");
}
```

<CourseCallout title="给自己一个小挑战">

尝试用 {} 打印数组，修复为 {:?}；再把 `String` 的 `clone` 去掉并使用原绑定，观察移动错误。

</CourseCallout>
