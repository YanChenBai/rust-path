// region:answer
struct Counter {
    value: u32,
}
impl Counter {
    fn add(&mut self, n: u32) {
        self.value = self.value.saturating_add(n)
    }
}
// endregion:answer

fn main() {
// region:tests
let mut c = Counter { value: 3 };
    c.add(4);
    assert_eq!(c.value, 7);
    c.add(u32::MAX);
    assert_eq!(c.value, u32::MAX);
// endregion:tests
    println!("__PASS__");
}
