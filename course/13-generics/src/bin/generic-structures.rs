struct Slot<T> {
    value: T,
}

impl<T> Slot<T> {
    fn get(&self) -> &T {
        &self.value
    }
    fn into_inner(self) -> T {
        self.value
    }
}

fn main() {
    // 把拥有值放入泛型容器，分别观察借用读取与消费取出。
    let slot = Slot {
        value: String::from("Rust"),
    };
    // 读取只借用，取出则消费整个容器。
    assert_eq!(slot.get(), "Rust");
    assert_eq!(slot.into_inner(), "Rust");
}
