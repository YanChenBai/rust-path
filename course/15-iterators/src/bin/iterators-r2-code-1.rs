// region:answer
fn positives(values: &[i32]) -> Vec<i64> {
    values
        .iter()
        .filter(|&&n| n > 0)
        .map(|&n| i64::from(n) * 2)
        .collect()
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(positives(&[-1, 0, 2, i32::MAX]), vec![4, 4294967294]);
    assert!(positives(&[]).is_empty());
// endregion:tests
    println!("__PASS__");
}
