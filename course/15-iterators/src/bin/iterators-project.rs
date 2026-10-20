// region:answer
fn top_minutes(input: &str, limit: usize) -> Vec<u32> {
    let mut values: Vec<u32> = input
        .lines()
        .filter_map(|s| s.trim().parse().ok())
        .filter(|&n| n > 0)
        .collect();
    values.sort_by(|a, b| b.cmp(a));
    values.truncate(limit);
    values
}
// endregion:answer

fn main() {
    // region:tests
    assert_eq!(
        top_minutes(
            "20
invalid
0
 30
30
-1",
            3
        ),
        vec![30, 30, 20]
    );
    assert!(top_minutes("1", 0).is_empty());
    assert!(top_minutes("", 5).is_empty());
    // endregion:tests
    println!("__PASS__");
}
