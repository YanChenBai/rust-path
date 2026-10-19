use std::ops::Deref;

struct Note(Box<String>);

impl Deref for Note {
    type Target = str;
    fn deref(&self) -> &str {
        self.0.as_str()
    }
}

impl Drop for Note {
    fn drop(&mut self) {
        // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
        println!("释放笔记");
    }
}

fn main() {
    // 从固定文本创建拥有存储的字符串，后续操作以这个值为输入。
    let note = Note(Box::new(String::from("Rust")));

    // Deref 强制转换提供借用，不转移 Note 的所有权。
    let view: &str = &note;

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(view, "Rust");

    // 主动消费所有者，提前触发 Drop。
    drop(note);
    println!("已结束借用与所有权");
}
