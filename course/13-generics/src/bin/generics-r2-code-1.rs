// region:answer
fn reverse_pair<T>(pair: (T, T)) -> (T, T) {
    (pair.1, pair.0)
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(reverse_pair((1, 2)), (2, 1));
    assert_eq!(
        reverse_pair((String::from("a"), String::from("b"))),
        (String::from("b"), String::from("a"))
    );
// endregion:tests
    println!("__PASS__");
}
