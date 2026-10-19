// region:answer
fn route(method: &str, path: &str) -> (u16, String) {
    if method != "GET" {
        (405, String::from("method"))
    } else if path == "/health" {
        (200, String::from("ok"))
    } else {
        (404, String::from("missing"))
    }
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(route("GET", "/health"), (200, String::from("ok")));
    assert_eq!(route("POST", "/health").0, 405);
    assert_eq!(route("GET", "/").0, 404);
// endregion:tests
    println!("__PASS__");
}
