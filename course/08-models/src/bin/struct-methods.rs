struct Counter {
    value: u32,
}

impl Counter {
    fn new(value: u32) -> Self {
        Self { value }
    }
    fn get(&self) -> u32 {
        self.value
    }
    fn add(&mut self, step: u32) {
        self.value = self.value.saturating_add(step);
    }
}

fn main() {
    // 创建初始值为 1 的计数器实例，后续通过方法修改内部字段。
    let mut count = Counter::new(1);
    count.add(2);

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(count.get(), 3);
}
