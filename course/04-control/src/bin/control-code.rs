// region:answer
fn sum_even(n: u32) -> u32 {
    (0..=n).filter(|x| x % 2 == 0).sum()
}
// endregion:answer

fn main() {
    // region:tests
    for (a, b) in [(0, 0), (1, 0), (2, 2), (9, 20), (10, 30), (20, 110)] {
        assert_eq!(sum_even(a), b);
    }
    // endregion:tests
    println!("__PASS__");
}
