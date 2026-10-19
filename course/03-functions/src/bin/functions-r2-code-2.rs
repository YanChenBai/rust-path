// region:answer
fn boosted(base: u32, bonus: u32) -> u64 {
    let total = {
        let b = u64::from(base);
        b + u64::from(bonus)
    };
    total
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(boosted(20, 5), 25);
    assert_eq!(boosted(u32::MAX, 1), 4294967296);
    assert_eq!(boosted(0, 0), 0);
// endregion:tests
    println!("__PASS__");
}
