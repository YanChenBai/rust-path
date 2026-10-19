mod domain {
    pub(crate) struct Minutes(pub u32);
    pub fn doubled(value: u32) -> Option<u32> {
        // 保存当前步骤得到的值，后续通过接口检查或转换。
        let value = Minutes(value);
        value.0.checked_mul(2)
    }
}
pub use domain::doubled;

fn main() {
    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(crate::doubled(12), Some(24));
    assert_eq!(doubled(u32::MAX), None);
}
