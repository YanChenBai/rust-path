// region:answer
fn merge_ranges(mut ranges: Vec<(u32, u32)>) -> Vec<(u32, u32)> {
    ranges.retain(|&(a, b)| a <= b);
    ranges.sort_unstable();
    let mut out: Vec<(u32, u32)> = Vec::new();
    for (a, b) in ranges {
        if let Some(last) = out.last_mut() {
            if a <= last.1 {
                last.1 = last.1.max(b);
                continue;
            }
        }
        out.push((a, b));
    }
    out
}
// endregion:answer

fn main() {
    // region:tests
    assert_eq!(
        merge_ranges(vec![(5, 8), (1, 3), (2, 6), (9, 10), (8, 8), (7, 2)]),
        vec![(1, 8), (9, 10)]
    );
    assert_eq!(
        merge_ranges(vec![(0, u32::MAX), (1, 2)]),
        vec![(0, u32::MAX)]
    );
    assert!(merge_ranges(vec![]).is_empty());
    // endregion:tests
    println!("__PASS__");
}
