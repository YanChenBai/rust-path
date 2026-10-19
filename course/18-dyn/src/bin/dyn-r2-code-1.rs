// region:answer
trait Value {
    fn value(&self) -> i32;
}
fn total(items: &[&dyn Value]) -> i64 {
    items.iter().map(|v| i64::from(v.value())).sum()
}
// endregion:answer

fn main() {
// region:tests
struct Fixed(i32);
    impl Value for Fixed {
        fn value(&self) -> i32 {
            self.0
        }
    }
    assert_eq!(total(&[&Fixed(i32::MAX), &Fixed(i32::MAX)]), 4294967294);
    assert_eq!(total(&[]), 0);
// endregion:tests
    println!("__PASS__");
}
