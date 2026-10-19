// region:answer
struct Session {
    name: String,
    minutes: u32,
}
impl Session {
    fn new(name: String) -> Self {
        Self { name, minutes: 0 }
    }
    fn add(&mut self, n: u32) {
        self.minutes = self.minutes.saturating_add(n)
    }
    fn summary(&self) -> String {
        format!("{}:{}", self.name, self.minutes)
    }
}
// endregion:answer

fn main() {
// region:tests
let mut s=Session::new(String::from("小林"));assert_eq!(s.summary(),"小林:0");s.add(25);assert_eq!(s.summary(),"小林:25");s.add(u32::MAX);assert_eq!(s.summary(),format!("小林:{}",u32::MAX));
// endregion:tests
    println!("__PASS__");
}
