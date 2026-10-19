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
