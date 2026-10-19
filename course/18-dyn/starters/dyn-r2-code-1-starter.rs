trait Value { fn value(&self) -> i32; }

fn total(items: &[&dyn Value]) -> i64 {
    todo!()
}

fn main() {}
