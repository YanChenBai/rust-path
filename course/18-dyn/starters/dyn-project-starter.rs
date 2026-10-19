trait Render {
    fn render(&self) -> String;
}
struct Text(String);
struct Count(u32);
fn report(items: &[&dyn Render]) -> String {
    todo!()
}
fn main() {}
