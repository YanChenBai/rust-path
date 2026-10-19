// region:answer
fn swap_values(a: &mut i32, b: &mut i32) {
    let old = *a;
    *a = *b;
    *b = old;
}
// endregion:answer

fn main() {
// region:tests
let (mut a, mut b) = (2, 9);
    swap_values(&mut a, &mut b);
    assert_eq!((a, b), (9, 2));
    swap_values(&mut a, &mut b);
    assert_eq!((a, b), (2, 9));
// endregion:tests
    println!("__PASS__");
}
