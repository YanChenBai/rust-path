// region:answer
mod domain {
    pub struct Minutes(u32);
    impl Minutes {
        pub fn new(n: u32) -> Option<Self> {
            if (1..=180).contains(&n) {
                Some(Self(n))
            } else {
                None
            }
        }
        pub fn get(&self) -> u32 {
            self.0
        }
    }
    pub fn parse(input: &str) -> Option<Minutes> {
        Minutes::new(input.trim().parse().ok()?)
    }
}
// endregion:answer

fn main() {
    // region:tests
    assert_eq!(domain::parse(" 25 ").unwrap().get(), 25);
    assert!(domain::parse("0").is_none());
    assert!(domain::parse("181").is_none());
    assert!(domain::parse("bad").is_none());
    assert!(domain::Minutes::new(0).is_none());
    // endregion:tests
    println!("__PASS__");
}
