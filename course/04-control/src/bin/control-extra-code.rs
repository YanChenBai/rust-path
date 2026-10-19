// region:answer
fn streak(minutes: &[u32], target: u32) -> usize {
    let mut days = 0;
    for &value in minutes {
        if value < target {
            break;
        }
        days += 1;
    }
    days
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(streak(&[], 20), 0);
assert_eq!(streak(&[30, 20, 5, 40], 20), 2);
assert_eq!(streak(&[19, 30], 20), 0);
assert_eq!(streak(&[20, 20, 21], 20), 3);
assert_eq!(streak(&[0, 1, 0], 0), 3);
assert_eq!(streak(&[u32::MAX, 0, u32::MAX], u32::MAX), 1);
// endregion:tests
    println!("__PASS__");
}
