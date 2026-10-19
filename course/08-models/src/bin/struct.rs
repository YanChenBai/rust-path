#[derive(Debug)]

struct Learner {
    name: String,
    xp: u32,
}

impl Learner {
    fn practice(&mut self) {
        self.xp += 25;
    }
}

fn main() {
    // 字段组成一个有意义的整体，方法通过 self 访问当前实例。

    // 创建学习者实例，把名字和进度放进同一个结构体。
    let mut learner = Learner {
        name: String::from("小林"),
        xp: 0,
    };
    learner.practice();

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{} 获得了 {} XP", learner.name, learner.xp);
}
