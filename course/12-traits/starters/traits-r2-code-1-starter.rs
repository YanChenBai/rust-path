trait Score { fn score(&self) -> i32; }

struct Fixed(i32);

impl Score for Fixed {
    fn score(&self) -> i32 { todo!() }
}

fn main() {}
