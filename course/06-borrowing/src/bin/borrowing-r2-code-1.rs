// region:answer
fn increase(value: &mut i32) {
    *value += 1;
}
// endregion:answer

fn main() {
// region:tests
let mut n = 0;
    increase(&mut n);
    assert_eq!(n, 1);
    let mut n = -2;
    increase(&mut n);
    assert_eq!(n, -1);
// endregion:tests
    println!("__PASS__");
}
