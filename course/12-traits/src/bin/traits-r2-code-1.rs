// region:answer
trait Score {
    fn score(&self) -> i32;
}
struct Fixed(i32);
impl Score for Fixed {
    fn score(&self) -> i32 {
        self.0
    }
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(Fixed(7).score(), 7);
    assert_eq!(Fixed(-2).score(), -2);
// endregion:tests
    println!("__PASS__");
}
