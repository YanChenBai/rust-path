#[derive(Debug)]

struct Learner {
    name: String,
    points: u32,
}

impl Learner {
    fn new(name: &str) -> Self {
        Self {
            name: name.to_owned(),
            points: 0,
        }
    }

    fn practice(&mut self, points: u32) {
        self.points = self.points.saturating_add(points);
    }

    fn summary(&self) -> String {
        format!("{}：{} 分", self.name, self.points)
    }
}

fn main() {
    // 创建学习者实例，把名字和进度放进同一个结构体。
    let mut learner = Learner::new("小林");
    learner.practice(25);

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(learner.points, 25);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{}，调试：{learner:?}", learner.summary());
}
