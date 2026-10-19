---
id: threads-locks
title: Mutex、RwLock 与 Send/Sync
subtitle: 共享所有权不等于共享修改权限
minutes: 18
nativeRequired: true
type: lesson
chapterId: shared
order: 0
---

## 锁守卫控制临界区，自动 trait 约束线程边界。

Arc 允许多个线程拥有同一分配，Mutex 通过互斥锁保护内部可变数据，二者分别解决存活与访问。lock 返回守卫，守卫析构才会释放锁；把守卫绑定在过大的作用域，会让不相关工作也串行。示例在短临界区更新状态，然后在 join 之后检查结果，不靠读取一个尚未同步的普通变量猜测完成。

RwLock 允许多个读者或一个写者，适合某些读多写少负载，但公平性与性能受平台和使用方式影响，不能保证总比 Mutex 快。持有读锁时再申请写锁可能死锁；多把锁需要统一获取顺序。标准库锁可能中毒，表示某个持锁线程发生恐慌，返回错误是在提醒你重新检查业务不变量，不应一律 unwrap 或无条件恢复。

Send 表示类型值可以安全地转移到另一线程，Sync 表示其共享引用可以安全地跨线程使用，也就是 &T 满足 Send。很多类型会自动推导这些 `trait`，Rc 不适合跨线程引用计数，Cell 和 RefCell 不提供同步共享修改。Arc&lt;T&gt; 的线程安全仍取决于 T 的相应约束。不要随意写 unsafe `impl` Send 或 Sync，错误实现会破坏安全代码依赖的前提。

<CourseCallout>

锁内避免网络调用、阻塞等待和回调；先复制必要快照，再释放守卫。

</CourseCallout>

## 亲手试一试

```rust playground id=threads-locks
use std::sync::{Arc, Mutex, RwLock};

fn require_send_sync<T: Send + Sync>() {}

fn main() {
    require_send_sync::<Arc<Mutex<u32>>>();

    // 保存计数器的访问入口，后续代码使用它更新或观察计数。
    let counter = Arc::new(Mutex::new(0u32));

    // 把共享数据的访问入口交给另一个使用者。
    let shared = Arc::clone(&counter);

    // 保存任务句柄，不能把启动任务误当作任务已经完成。
    let job = std::thread::spawn(move || {
        // 保存借用或锁守卫；其存活期间相应访问约束一直有效。
        let mut guard = shared.lock().expect("锁未中毒");
        *guard += 1;
    });

    // 等待线程结束后再读取最终结果。
    job.join().unwrap();

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(*counter.lock().unwrap(), 1);

    // 保存共享标题，读写访问需要遵守所选同步原语的约束。
    let title = RwLock::new(String::from("draft"));
    {
        *title.write().unwrap() = "ready".into();
    }
    assert_eq!(title.read().unwrap().as_str(), "ready");
}
```

<CourseCallout title="给自己一个小挑战">

缩短写守卫作用域，再在另一个线程读取快照，解释 join 提供的完成关系。

</CourseCallout>
