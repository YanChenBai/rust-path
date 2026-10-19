---
type: guide
lessonId: vec
index: 3
title: 键的归属与结果顺序要明确
mistake: 预留容量不等于创建元素；HashMap 的遍历顺序不保证稳定。不要在元素共享引用稍后还要使用时调用可能改变 Vec 的 push。
---

### 4. 键的归属与结果顺序要明确

`HashMap`&lt;`String`, V&gt; 拥有键文本，而 `HashMap`&lt;`&str`, V&gt; 借用已有文本，被借用的数据必须保持有效。示例中的名字来自字符串字面量，可以安全借用；读取文件后切出的名字若要脱离原缓冲区保存，通常需要转成 `String`。`HashMap` 查询适合按键定位，展示有序排名则需收集后排序，并对同分情况指定次要排序规则。
<CourseCallout title="容易混淆的地方">

预留容量不等于创建元素；`HashMap` 的遍历顺序不保证稳定。不要在元素共享引用稍后还要使用时调用可能改变 `Vec` 的 push。

</CourseCallout>
