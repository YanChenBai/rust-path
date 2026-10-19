fn sum_lines<R: std::io::BufRead>(reader: R) -> Result<i64, String> {
    todo!()
}

fn main() {
    println!("{:?}", sum_lines(std::io::Cursor::new("1\n2\n")));
}
