// region:answer
trait Render {
    fn render(&self) -> String;
}
struct Text(String);
struct Count(u32);
impl Render for Text {
    fn render(&self) -> String {
        self.0.clone()
    }
}
impl Render for Count {
    fn render(&self) -> String {
        self.0.to_string()
    }
}
fn report(items: &[&dyn Render]) -> String {
    items.iter().map(|x| x.render()).collect::<Vec<_>>().join(
        "
",
    )
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(report(&[&Text(String::from("你好")),&Count(7)]),"你好
7");assert_eq!(report(&[]),"");
// endregion:tests
    println!("__PASS__");
}
