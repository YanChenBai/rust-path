// minutes 是输入的学习分钟数，返回按每分钟 2 XP 计算的奖励。
fn reward(minutes: u32) -> u32 {
    if minutes == 0 {
        return 0;
    }
    minutes * 2
}

fn main() {
    // 函数签名约束参数和返回值，调用位置决定执行顺序。

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("奖励 {} XP", reward(25));
}
