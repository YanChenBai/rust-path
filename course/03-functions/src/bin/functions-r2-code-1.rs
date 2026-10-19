// region:answer
fn minutes(hours: u32, extra: u32) -> u64 {
    u64::from(hours) * 60 + u64::from(extra)
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(minutes(2, 15), 135);
    assert_eq!(minutes(0, 0), 0);
    assert_eq!(minutes(u32::MAX, 0), 257698037700);
// endregion:tests
    println!("__PASS__");
}
