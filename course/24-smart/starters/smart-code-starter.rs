fn try_add(cell: &std::cell::RefCell<i32>, delta: i32) -> bool {
    todo!()
}

fn main() {
    let n = std::cell::RefCell::new(1);
    assert!(try_add(&n, 2));
}
