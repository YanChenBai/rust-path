struct Excerpt<'a> {
    text: &'a str,
}

impl Excerpt<'_> {
    fn text(&self) -> &str {
        self.text
    }
}

fn main() {
    // 拥有原始文本；借用视图使用期间，这份数据必须保持有效。
    let source = String::from("第一段。第二段。");

    // 借用底层内容进行读取，不接管拥有者的清理责任。
    let view = Excerpt { text: &source[..9] };
    // 视图借用 source；source 在使用期间必须存活。
    assert_eq!(view.text(), "第一段");
}
