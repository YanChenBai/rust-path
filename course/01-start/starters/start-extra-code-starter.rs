fn checkin(name: &str, day: u32) -> String {
    // 参数已经提供，使用花括号把 name 与 day 放进模板。
    format!("请修改签到模板：{name} / {day}")
}

fn main() {
    println!("{}", checkin("小林", 2));
}
