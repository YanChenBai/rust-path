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
