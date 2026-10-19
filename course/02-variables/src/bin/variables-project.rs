// region:answer
fn report(days: u32, minutes: u32) -> (u32, u32) { let total = days * minutes; (total / 60, total % 60) }
// endregion:answer

fn main() {
// region:tests
assert_eq!(report(3,45),(2,15)); assert_eq!(report(0,45),(0,0)); assert_eq!(report(7,30),(3,30)); assert_eq!(report(2,60),(2,0));
// endregion:tests
    println!("__PASS__");
}
