fn count_records<R: std::io::BufRead>(reader: R) -> std::io::Result<usize> {
    todo!()
}

fn main() {
    let input = std::io::Cursor::new("# config\nport=80\n");
    println!("{:?}", count_records(input));
}
