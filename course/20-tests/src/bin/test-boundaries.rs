// 阈值 60 是业务边界；边界测试用于防止把 >= 错写成 >。
fn fee(minutes: u32) -> u32 {
    if minutes >= 60 { 10 } else { 0 }
}
#[cfg(test)]
mod tests {
    use super::fee;
    #[test]
    fn boundary() {
        for (input, expected) in [(0, 0), (59, 0), (60, 10), (61, 10)] {
            // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
            assert_eq!(fee(input), expected);
        }
    }
}

fn main() {
    for (input, expected) in [(0, 0), (59, 0), (60, 10), (61, 10)] {
        assert_eq!(fee(input), expected);
    }

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("边界检查通过");
}
