// region:answer
mod model {
    pub struct Counter(u32);
    impl Counter {
        pub fn new(n: u32) -> Self {
            Self(n)
        }
        pub fn get(&self) -> u32 {
            self.0
        }
    }
}
// endregion:answer

fn main() {
// region:tests
let c = model::Counter::new(7);
    assert_eq!(c.get(), 7);
    assert_eq!(model::Counter::new(0).get(), 0);
// endregion:tests
    println!("__PASS__");
}
