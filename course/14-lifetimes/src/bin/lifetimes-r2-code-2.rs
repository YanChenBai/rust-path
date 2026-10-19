// region:answer
fn choose<'a>(left: &'a str, right: &'a str, use_left: bool) -> &'a str {
    if use_left { left } else { right }
}
// endregion:answer

fn main() {
// region:tests
let a = String::from("a");
    let b = String::from("b");
    assert_eq!(choose(&a, &b, true), "a");
    assert_eq!(choose(&a, &b, false), "b");
// endregion:tests
    println!("__PASS__");
}
