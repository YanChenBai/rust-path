// region:answer
fn status_code(response: &str) -> Option<u16> {
    let mut words = response.lines().next()?.split_ascii_whitespace();
    let version = words.next()?;
    if !matches!(version, "HTTP/1.0" | "HTTP/1.1") {
        return None;
    }
    let token = words.next()?;
    if token.len() != 3 || !token.bytes().all(|b| b.is_ascii_digit()) {
        return None;
    }
    let code = token.parse::<u16>().ok()?;
    (100..=599).contains(&code).then_some(code)
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(status_code("HTTP/1.1 200 OK\r\nContent-Length: 0\r\n\r\n"), Some(200));
assert_eq!(status_code("HTTP/1.0 404 Not Found"), Some(404));
assert_eq!(status_code("HTTP/1.1 100"), Some(100));
assert_eq!(status_code("HTTP/1.1\t599 Custom"), Some(599));
assert_eq!(status_code("  HTTP/1.1 204  "), Some(204));
assert_eq!(status_code("HTTP/1.1 200 OK\nHTTP/1.1 999 Bad"), Some(200));
for input in ["", " ", "\nHTTP/1.1 200 OK", "HTTP/1.1", "HTTP/2 200 OK", "http/1.1 200 OK", "HTTP/1.1 099", "HTTP/1.1 600", "HTTP/1.1 0200", "HTTP/1.1 +200", "HTTP/1.1 20", "HTTP/1.1 2xx", "HTTP/1.1 ２００", "HTTP/1.1　200"] {
    assert_eq!(status_code(input), None, "input: {input:?}");
}
// endregion:tests
    println!("__PASS__");
}
