// region:answer
trait Named {
    fn name(&self) -> &str;
}
struct User(String);
impl Named for User {
    fn name(&self) -> &str {
        &self.0
    }
}
// endregion:answer

fn main() {
// region:tests
let user = User(String::from("小林"));
    let named: &dyn Named = &user;
    assert_eq!(named.name(), "小林");
    assert_eq!(user.0, "小林");
// endregion:tests
    println!("__PASS__");
}
