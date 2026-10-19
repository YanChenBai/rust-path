trait Minutes {
    fn minutes(&self) -> u32;
}

struct Session(u32);
impl Minutes for Session {
    fn minutes(&self) -> u32 {
        self.0
    }
}

fn main() {
    // 创建具体类型的实例，再调用该类型实现的行为。
    let session = Session(25);

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(session.minutes(), 25);
}
