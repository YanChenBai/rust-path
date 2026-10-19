trait Named { fn name(&self) -> &str; }

struct User(String);

impl Named for User {
    fn name(&self) -> &str { todo!() }
}

fn main() {}
