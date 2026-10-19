#[derive(Debug, PartialEq)]
enum Task {
    Pending,
    Running(u32),
    Done(u32),
}
fn advance(task: Task, minutes: u32) -> Task {
    todo!()
}
fn main() {}
