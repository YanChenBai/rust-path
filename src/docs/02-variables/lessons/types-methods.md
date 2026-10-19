---
id: types-methods
title: 常用方法：返回新值还是修改原值
subtitle: 方法不是所有类型共享的一套命令
minutes: 18
type: lesson
chapterId: variables
order: 5
---

## 先确认值的类型，再查方法的参数、返回值和访问方式。

整数有 abs、pow、checked_add 等数值操作，但没有通用 `len`；数组、切片、字符串和 `Vec` 等集合才有各自的长度接口。即使名称一样，含义也要看类型：字符串 `len` 是字节数，数组 `len` 是元素个数。不能只记方法名字就推断它对所有值做相同的事。

text.trim() 返回去掉外侧空白后的借用文本，不修改原 text。text.to_uppercase() 返回新 `String`，也不原地改大写。相反，`String` 的 push、push_str、clear 需要可变访问并修改原值。对不修改的方法加 `mut` 没有必要，对真正修改的方法则要有可变绑定。观察返回值是否被使用，是理解示例的重要步骤。

标准库文档签名中的 &self 通常表示只读访问，&`mut` self 表示需要可变访问，self 表示按值接收，可能消费原值。暂时不熟悉引用符号时，先用本节对照例子建立直觉，后面的借用章节会解释限制。悬浮提示和类型检查能帮助确认类型，但教程仍应先说明为何选择这个接口，而不是要求你猜方法。

<CourseCallout>

trim 不原地清理，to_uppercase 不原地大写；push_str 才会改变可变 `String`。

</CourseCallout>

## 亲手试一试

```rust playground id=types-methods
fn main() {
    // 保留未处理的输入，方便对比方法是否修改原数据。
    let original = "  Rust  ";

    // 保存去除外侧空白后的文本视图，原输入保持不变。
    let cleaned = original.trim();

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(original, "  Rust  ");
    assert_eq!(cleaned, "Rust");

    // 从固定文本创建拥有存储的字符串，后续操作以这个值为输入。
    let mut text = String::from(cleaned);

    // 保存大写转换生成的新字符串，原文本不会被这个方法改写。
    let upper = text.to_uppercase();

    // 把这一段文本追加到可变 String，已有内容不会被覆盖。
    text.push_str(" language");
    assert_eq!(upper, "RUST");
    assert_eq!(text, "Rust language");

    // 准备待处理的输入序列，后续会读取其中的元素并验证计算结果。
    let values = [10, 20, 30];
    assert_eq!(values.len(), 3);
    assert_eq!((-7i32).abs(), 7);
    assert_eq!(2u32.pow(3), 8);
}
```

<CourseCallout title="给自己一个小挑战">

删掉保存 trim 返回值的那行，观察原文本是否改变；再对数字调用 `len`，读诊断。

</CourseCallout>
