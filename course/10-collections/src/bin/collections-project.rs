// region:answer
fn word_counts(input: &str) -> Vec<(String, usize)> {
    let mut out: Vec<(String, usize)> = Vec::new();
    for word in input.split_whitespace() {
        if let Some(row) = out.iter_mut().find(|(name, _)| name == word) {
            row.1 += 1;
        } else {
            out.push((word.to_owned(), 1));
        }
    }
    out
}
// endregion:answer

fn main() {
    // region:tests
    assert_eq!(
        word_counts("Rust 学习 Rust 学习 新"),
        vec![
            (String::from("Rust"), 2),
            (String::from("学习"), 2),
            (String::from("新"), 1)
        ]
    );
    assert!(word_counts("  ").is_empty());
    assert_eq!(
        word_counts("a A a"),
        vec![(String::from("a"), 2), (String::from("A"), 1)]
    );
    // endregion:tests
    println!("__PASS__");
}
