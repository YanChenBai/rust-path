// region:answer
#[derive(Debug, PartialEq)]
enum Task {
    Pending,
    Running(u32),
    Done(u32),
}
fn advance(task: Task, minutes: u32) -> Task {
    match task {
        Task::Pending if minutes == 0 => Task::Pending,
        Task::Pending => {
            if minutes >= 60 {
                Task::Done(minutes)
            } else {
                Task::Running(minutes)
            }
        }
        Task::Running(n) => {
            let total = n.saturating_add(minutes);
            if total >= 60 {
                Task::Done(total)
            } else {
                Task::Running(total)
            }
        }
        done @ Task::Done(_) => done,
    }
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(advance(Task::Pending,0),Task::Pending);assert_eq!(advance(Task::Pending,20),Task::Running(20));assert_eq!(advance(Task::Pending,60),Task::Done(60));assert_eq!(advance(Task::Running(40),20),Task::Done(60));assert_eq!(advance(Task::Done(60),99),Task::Done(60));
// endregion:tests
    println!("__PASS__");
}
