// region:answer
fn in_range<T: Ord>(value: &T, low: &T, high: &T) -> bool {
    low <= value && value <= high
}
// endregion:answer

fn main() {
// region:tests
assert!(in_range(&3, &3, &5));
    assert!(!in_range(&2, &3, &5));
    assert!(!in_range(&4, &5, &3));
    assert!(in_range(
        &String::from("b"),
        &String::from("a"),
        &String::from("c")
    ));
// endregion:tests
    println!("__PASS__");
}
