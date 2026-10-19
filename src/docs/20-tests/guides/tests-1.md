---
type: guide
lessonId: tests
index: 1
title: 一份示例同时支持普通运行与测试运行
---

### 2. 一份示例同时支持普通运行与测试运行

下面 `main` 用断言展示正常行为，tests 模块由 cfg(test) 限定，只在测试构建中编译。第一项测试用表格覆盖零、边界前后和多个完整小时；第二项刻意传入超出约定的值，并要求出现特定提示。普通运行验证四个输入，测试运行器则会发现并运行两个测试；修改除数后能观察哪些边界用例首先失败。

```rust runnable id=tests-guide-1
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
```
