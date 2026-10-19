// region:answer
fn json_response(body: &str) -> String {
    format!("HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}", body.len(), body)
}
// endregion:answer

fn main() {
// region:tests
let r = json_response("你好");
assert!(r.contains("Content-Length: 6\r\n"));
assert!(r.ends_with("\r\n\r\n你好"));
assert!(json_response("").contains("Content-Length: 0\r\n"));
// endregion:tests
    println!("__PASS__");
}
