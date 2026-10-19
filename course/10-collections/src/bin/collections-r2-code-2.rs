// region:answer
fn at(values: &[i32], index: usize) -> Option<i32> {
    values.get(index).copied()
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(at(&[2, 4], 1), Some(4));
    assert_eq!(at(&[2, 4], 2), None);
    assert_eq!(at(&[], 0), None);
// endregion:tests
    println!("__PASS__");
}
