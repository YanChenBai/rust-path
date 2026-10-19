fn full_hours(minutes: u32) -> u32 {
    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert!(minutes <= 1440, "超过一天");
    minutes / 60
}

fn main() {
    for (minutes, expected) in [(0, 0), (59, 0), (60, 1), (61, 1)] {
        assert_eq!(full_hours(minutes), expected);
    }

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("主函数中的边界断言通过");
}

#[cfg(test)]

mod tests {
    use super::full_hours;

    #[test]
    fn covers_hour_boundaries() {
        for (minutes, expected) in [(0, 0), (59, 0), (60, 1), (61, 1), (120, 2)] {
            assert_eq!(full_hours(minutes), expected, "输入 {minutes}");
        }
    }

    #[test]
    #[should_panic(expected = "超过一天")]
    fn rejects_more_than_one_day() {
        full_hours(1441);
    }
}
