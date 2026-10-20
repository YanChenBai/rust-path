// region:answer
fn summarize(input: &str, limit: usize) -> Vec<String> {
    input
        .lines()
        .map(str::trim)
        .filter(|s| !s.is_empty())
        .map(|s| s.chars().take(limit).collect())
        .collect()
}
// endregion:answer

fn main() {
    // region:tests
    assert_eq!(
        summarize(
            "  你好世界 

 🦀Rust ",
            2
        ),
        vec!["你好", "🦀R"]
    );
    assert!(
        summarize(
            " 
", 3
        )
        .is_empty()
    );
    assert_eq!(
        summarize(
            "a
b", 0
        ),
        vec!["", ""]
    );
    // endregion:tests
    println!("__PASS__");
}
