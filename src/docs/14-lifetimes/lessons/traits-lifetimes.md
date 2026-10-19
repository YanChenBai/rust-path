---
id: traits-lifetimes
title: 生命周期是关系
subtitle: 返回引用必须来自仍存活的数据
minutes: 18
type: lesson
chapterId: lifetimes
order: 0
---

## 标注描述借用约束，不改变对象的存活时间。

返回引用的函数需要说明结果可能借用了哪个输入。示例把两个输入和输出写成同一个生命周期参数，表示调用者使用返回值的这段时间必须同时落在两个输入都有效的范围内。编译器会在调用位置寻找满足条件的较短范围，而不是要求两个 `String` 在同一时刻创建或销毁。

省略规则可以处理很多简单签名，例如只有一个输入引用的函数，其输出借用通常归属于该输入。多个候选来源无法靠规则判断时，需要显式标注。含有引用字段的结构体同样必须携带对应关系；相比之下，返回拥有所有权的 `String` 不再借用输入，但可能需要分配和复制，不能把这两种接口当作完全相同的优化方案。

函数无法返回局部 `String` 的切片，写上 'a 或 'static 都不能修复已被销毁的数据。'static 引用要求被引用的数据可在整个程序期间有效；T: 'static 则约束 T 不包含较短借用，并不代表该值永远不能释放。示例按字符数量比较，避免中文的 UTF-8 字节长度干扰题意，但 chars 统计的是 Unicode 标量值而非用户感知字形。

<CourseCallout>

生命周期错误先画出所有者与引用的作用域，再考虑修改签名。

</CourseCallout>

## 亲手试一试

```rust playground id=traits-lifetimes
// 输入与输出的生命周期标注描述借用关系，不延长数据的存活时间。

// 两个输入和返回值共享借用约束，返回其中一个原切片，不创建新文本。
fn longer<'a>(left: &'a str, right: &'a str) -> &'a str {
    if left.chars().count() >= right.chars().count() {
        left
    } else {
        right
    }
}

fn main() {
    // 保存本次示例使用的名称文本，后面用于构造输出或比较。
    let name = String::from("你好");

    // 保存第二个候选文本，供生命周期示例比较两个输入。
    let other = String::from("Rust");

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(longer(&name, &other), "Rust");
    assert_eq!(longer("甲乙", "ab"), "甲乙");
}
```

<CourseCallout title="给自己一个小挑战">

把其中一个输入放到内部作用域，观察返回值在外部使用为何会失败。

</CourseCallout>
