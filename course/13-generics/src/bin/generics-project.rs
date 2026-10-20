// region:answer
fn unique<T: PartialEq>(items: Vec<T>) -> Vec<T> {
    let mut out = Vec::new();
    for item in items {
        if !out.contains(&item) {
            out.push(item);
        }
    }
    out
}
// endregion:answer

fn main() {
    // region:tests
    assert_eq!(unique(vec![2, 1, 2, 3, 1]), vec![2, 1, 3]);
    assert!(unique::<String>(vec![]).is_empty());
    assert_eq!(
        unique(vec![
            String::from("甲"),
            String::from("甲"),
            String::from("乙")
        ]),
        vec!["甲", "乙"]
    );
    // endregion:tests
    println!("__PASS__");
}
