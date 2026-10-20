// region:answer
fn try_add(cell: &std::cell::RefCell<i32>, delta: i32) -> bool {
    let Ok(mut value) = cell.try_borrow_mut() else {
        return false;
    };
    let Some(next) = value.checked_add(delta) else {
        return false;
    };
    *value = next;
    true
}
// endregion:answer

fn main() {
    // region:tests
    let value = std::cell::RefCell::new(2);
    assert!(try_add(&value, 3));
    assert_eq!(*value.borrow(), 5);
    let guard = value.borrow();
    assert!(!try_add(&value, 1));
    drop(guard);
    assert!(try_add(&value, -7));
    assert_eq!(*value.borrow(), -2);
    let limit = std::cell::RefCell::new(i32::MAX);
    assert!(!try_add(&limit, 1));
    assert_eq!(*limit.borrow(), i32::MAX);
    // endregion:tests
    println!("__PASS__");
}
