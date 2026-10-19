// region:answer
fn split_seconds(total: u32) -> (u32, u32) {
    (total / 60, total % 60)
}
// endregion:answer

fn main() {
// region:tests
for (input, expected) in [(0, (0, 0)), (1, (0, 1)), (59, (0, 59)), (60, (1, 0)), (61, (1, 1)), (125, (2, 5)), (u32::MAX, (71582788, 15))] {
    assert_eq!(split_seconds(input), expected);
}
// endregion:tests
    println!("__PASS__");
}
