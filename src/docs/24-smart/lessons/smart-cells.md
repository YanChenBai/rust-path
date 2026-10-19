---
id: smart-cells
title: Cell 与 RefCell 的边界
subtitle: 共享引用下的修改仍有约束
minutes: 18
type: lesson
chapterId: smart
order: 2
---

## 内部可变性改变检查位置，不取消借用规则。

Cell&lt;T&gt; 通过取出、替换整个值来修改内容，适合计数器或小型状态。对实现 `Copy` 的值，可以用 get 读取；set 写入新值时不向外暴露内部引用。RefCell&lt;T&gt; 则通过运行时计数检查共享借用与独占借用，borrow 返回 Ref 守卫，borrow_mut 返回 RefMut 守卫，守卫释放后借用才结束。

当共享借用还存在时调用 borrow_mut 会恐慌。如果冲突是可预期的控制流，应选择 try_borrow 或 try_borrow_mut，把失败作为 `Result` 处理，而不是捕获恐慌继续工作。示例用内部作用域缩短守卫存活时间，让第二次修改能够成功；链式表达式里的临时守卫也有生命周期，调试冲突时不要只看变量名。

Rc&lt;RefCell&lt;T&gt;&gt; 是单线程可变图结构中的常见组合：Rc 管谁拥有，RefCell 管谁当前可访问。它不适合跨线程共享，需要跨线程时应重新考虑 Arc&lt;Mutex&lt;T&gt;&gt; 等同步结构。内部可变性应封装在小接口后面，避免让每个调用者负责借用顺序；如果返回借用守卫，还要意识到它会延长对象被占用的时间。

<CourseCallout>

把 try_borrow_mut 的失败与业务错误区分开，避免只返回含糊的成功标志。

</CourseCallout>

## 亲手试一试

```rust playground id=smart-cells
use std::cell::{Cell, RefCell};

fn main() {
    // 保存访问次数，后续通过受控的可变访问更新。
    let visits = Cell::new(0);
    visits.set(visits.get() + 1);

    // 保存拥有文本的集合，验证接口并不要求元素都是 Copy。
    let names = RefCell::new(vec![String::from("Ada")]);
    {
        // 守卫存活期间只能共享读取，不能再取得独占借用。
        let guard = names.borrow();

        // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
        assert!(names.try_borrow_mut().is_err());
        assert_eq!(guard.len(), 1);
    }

    // 离开上面的作用域后守卫已释放，此时可以修改。
    names.borrow_mut().push(String::from("Lin"));
    assert_eq!(names.borrow().len(), 2);
    assert_eq!(visits.get(), 1);
}
```

<CourseCallout title="给自己一个小挑战">

持有共享守卫时尝试修改，再显式 drop 守卫重试；确认失败时原值不变。

</CourseCallout>
