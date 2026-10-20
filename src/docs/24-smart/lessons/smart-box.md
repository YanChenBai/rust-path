---
id: smart-box
title: Box、Deref 与 Drop
subtitle: 所有权容器如何表现得像引用
minutes: 18
type: lesson
chapterId: smart
order: 0
advanced: true
---

## 堆分配解决布局问题，析构负责作用域内的资源管理。

Box&lt;T&gt; 把值放在堆上，变量本身保存拥有所有权的指针。递归数据结构如果直接嵌套自身，编译器无法计算有限大小；把递归边放进 Box 后，外层结构的布局就能确定。Box 不意味着共享所有权，移动 Box 会转移管理责任，解引用也不代表总能把被借用的数据移动出来。

Deref 定义如何从容器取得目标类型的共享引用。解引用强制转换可以把 `&Box<String>` 逐步转换成 `&str`，因此调用接收字符串切片的函数时通常不必手写多层星号。自定义 Deref 应保留清晰的指针语义，不能把它当成任意隐式类型转换机制；需要可变解引用时，还必须满足独占访问并实现 DerefMut。

Drop 在值离开作用域时运行，适合释放文件、锁守卫或记录生命周期。不能直接调用对象的 drop 方法来重复析构，提前释放使用 `std::mem::drop`，它消费该值。示例用自定义包装展示 Deref 和 Drop，普通路径上可以观察提前释放；进程被强制终止或采用 abort 恐慌策略时，不能把析构当作绝对可靠的持久化机制。

<CourseCallout>

Drop 的执行时机取决于拥有值的作用域；借用不会获得清理责任。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

把显式 drop 移除，比较日志顺序；用 Box 为递归枚举增加结束节点。

</CourseCallout>

```rust playground id=smart-box source=24-smart/src/bin/smart-box.rs

```
