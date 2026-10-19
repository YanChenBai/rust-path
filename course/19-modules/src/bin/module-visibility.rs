mod domain {
    pub struct Minutes(u32);
    impl Minutes {
        pub fn new(value: u32) -> Option<Self> {
            if value <= 180 {
                Some(Self(value))
            } else {
                None
            }
        }
        pub fn get(&self) -> u32 {
            self.0
        }
    }
}

fn main() {
    // 保存当前步骤得到的值，后续通过接口检查或转换。
    let value = domain::Minutes::new(25).unwrap();

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(value.get(), 25);
    assert!(domain::Minutes::new(181).is_none());
}
