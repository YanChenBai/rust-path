// region:answer
fn distance(a: i32, b: i32) -> u64 {
    (i64::from(a) - i64::from(b)).unsigned_abs()
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(distance(1, 1), 0);
    assert_eq!(distance(-3, 4), 7);
    assert_eq!(distance(i32::MIN, i32::MAX), 4294967295);
// endregion:tests
    println!("__PASS__");
}
