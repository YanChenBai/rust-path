---
id: text-slices
title: 从数组切片到字符串切片
subtitle: 切片是已有连续数据的一段借用，不拥有数据。
minutes: 16
type: lesson
chapterId: strings
order: 0
---

## 切片是已有连续数据的一段借用，不拥有数据。

[T; N] 的长度是类型的一部分，&[T] 则在运行时携带长度，可以同时接收数组和 `Vec` 的借用。范围 a..b 包含 a、不包含 b；a 与 b 可以相等，形成空切片。直接索引要求范围合法，来自外部的索引应通过 get 获取可检查的 `Option`。

str 是 UTF-8 编码的字符串内容，`&str` 借用它，`String` 拥有可增长的字符串。`String::len` 统计字节数，chars().count() 统计 Unicode 标量值；二者都不等于一般意义上的用户感知字符数。中文和 emoji 往往占用多个字节，因此不能把任意字符序号当作字节偏移。

示例刻意比较“你好”的字节长度与字符数量。get(0..3) 恰好位于 UTF-8 边界，get(0..1) 则安全返回 `None`。不要在通用文本处理中依赖“一个中文总是三个字节”；用 chars 迭代，或根据 char_indices 得到有效字节边界。

<CourseCallout>

字符串切片的起止位置必须既在范围内，又位于 UTF-8 编码边界。

</CourseCallout>

## 亲手试一试

```rust playground id=text-slices
fn main() {
    // 准备待处理的输入序列，后续会读取其中的元素并验证计算结果。
    let values = [10, 20, 30];

    // 借用原序列的一段连续元素，不复制数组内容。
    let middle: &[i32] = &values[1..3];

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(middle, &[20, 30]);

    // 从固定文本创建拥有存储的字符串，后续操作以这个值为输入。
    let text = String::from("你好");
    // 字节数与 Unicode 标量值数量不是一回事。
    assert_eq!(text.len(), 6);
    assert_eq!(text.chars().count(), 2);
    assert_eq!(text.get(0..3), Some("你"));
    assert_eq!(text.get(0..1), None);
}
```

<CourseCallout title="给自己一个小挑战">

把文本换为包含 emoji 的字符串，比较 `len`、chars 和切片结果。

</CourseCallout>
