// region:answer
fn daily(hours: u32, extra: u32) -> u64 {
    u64::from(hours) * 60 + u64::from(extra)
}
fn plan(days: u32, hours: u32, extra: u32) -> u64 {
    daily(hours, extra) * u64::from(days)
}
// endregion:answer

fn main() {
    // region:tests
    assert_eq!(daily(1, 30), 90);
    assert_eq!(plan(3, 1, 30), 270);
    assert_eq!(plan(0, 1, 30), 0);
    assert_eq!(plan(2, u32::MAX, 0), 515396075400);
    // endregion:tests
    println!("__PASS__");
}
