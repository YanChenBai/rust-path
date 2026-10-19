fn status_code(response: &str) -> Option<u16> {
    todo!()
}

fn main() {
    println!("{:?}", status_code("HTTP/1.1 200 OK\r\n\r\n"));
}
