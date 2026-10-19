// region:answer
fn divide(a: u32, b: u32) -> Option<u32> {
    if b == 0 { None } else { Some(a / b) }
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(divide(7, 2), Some(3));
    assert_eq!(divide(0, 2), Some(0));
    assert_eq!(divide(1, 0), None);
// endregion:tests
    println!("__PASS__");
}
