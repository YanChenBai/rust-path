---
id: smart-sharing
title: Rc、Weak 与引用环
subtitle: 共享所有权必须设计释放方向
minutes: 18
type: lesson
chapterId: smart
order: 1
---

## 强引用决定存活，弱引用只观察。

Rc&lt;T&gt; 为单线程数据提供引用计数共享所有权。`Rc::clone` 只增加计数，不会深复制内部对象。最后一个强引用消失时，内部 T 被析构；弱引用可能继续保留计数控制块，直到弱引用也消失。`Weak::upgrade` 返回 `Option`&lt;Rc&lt;T&gt;&gt;，使用者必须接受对象可能已经释放这一事实。

父子双向关系是理解引用环的好场景。若父亲用 Rc 持有孩子，孩子也用 Rc 持有父亲，即使外部不再使用这棵树，环内计数仍然无法归零。通常把父到子的拥有边保留为强引用，把子到父的观察边改成 Weak。内存安全并不保证没有资源泄漏，类型系统不会自动判断业务图中哪些边不应拥有对象。

跨线程共享通常使用 Arc，其引用计数更新具有原子性。但 Arc 只同步所有权计数，不会自动同步 T 内部的读写；Arc&lt;RefCell&lt;T&gt;&gt; 也不能凭空变成线程安全数据。选择容器时先判断是否真的需要多位拥有者，再判断线程边界与写入方式。示例只操作 Rc 与 Weak，不涉及线程；并发共享将在后续章节配合同步原语实现。

<CourseCallout>

用 `Rc::ptr_eq` 判断是否同一分配，用值相等判断内容，二者用途不同。

</CourseCallout>

## 亲手试一试

```rust playground id=smart-sharing
use std::rc::Rc;
use std::sync::Arc;

fn main() {
    // 创建共享数据的强引用所有者，由强引用数量决定数据存活。
    let owner = Rc::new(String::from("共享"));

    // 弱引用只观察对象，不延长被观察值的生命周期。
    let observer = Rc::downgrade(&owner);

    // 这里只增加强引用计数，不复制内部字符串。
    let second = Rc::clone(&owner);

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(Rc::strong_count(&owner), 2);

    // 主动释放这个值或守卫，观察资源存活与访问范围的变化。
    drop(owner);
    assert!(observer.upgrade().is_some());
    drop(second);

    // 最后一个强引用已释放，升级弱引用会返回 None。
    assert!(observer.upgrade().is_none());

    // Arc 提供跨线程可用的引用计数；这里先观察它的拥有语义。
    let shared = Arc::new(7);
    assert_eq!(*Arc::clone(&shared), 7);
}
```

<CourseCallout title="给自己一个小挑战">

保留一个 Weak，依次释放两个强引用，检查每次 upgrade 的结果。

</CourseCallout>
