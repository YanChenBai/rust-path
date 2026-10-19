// region:answer
fn apply_twice<F: FnMut(i32) -> i32>(value: i32, mut f: F) -> i32 {
    let first = f(value);
    f(first)
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(apply_twice(2, |n| n * 2), 8);
    let mut calls = 0;
    assert_eq!(
        apply_twice(0, |n| {
            calls += 1;
            n + calls
        }),
        3
    );
    assert_eq!(calls, 2);
// endregion:tests
    println!("__PASS__");
}
