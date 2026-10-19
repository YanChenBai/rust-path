// region:answer
fn greeting() -> String { String::from("Hello, Rust!") }
// endregion:answer

fn main() {
// region:tests
assert_eq!(greeting(), "Hello, Rust!");
// endregion:tests
    println!("__PASS__");
}
