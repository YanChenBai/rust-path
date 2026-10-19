struct Minutes(u32);
impl TryFrom<u32> for Minutes {
    type Error = &'static str;
    fn try_from(value: u32) -> Result<Self, Self::Error> {
        if value <= 180 {
            Ok(Self(value))
        } else {
            Err("range")
        }
    }
}

fn main() {
    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(Minutes::try_from(25).unwrap().0, 25);
    assert!(Minutes::try_from(181).is_err());
    assert!(u8::try_from(256u32).is_err());
}
