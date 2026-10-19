// region:answer
mod config {
    pub fn default_port() -> u16 {
        8080
    }
}

fn selected_port(value: Option<u16>) -> u16 {
    value.unwrap_or_else(config::default_port)
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(config::default_port(), 8080);
assert_eq!(selected_port(None), 8080);
assert_eq!(selected_port(Some(0)), 0);
assert_eq!(selected_port(Some(80)), 80);
assert_eq!(selected_port(Some(8080)), 8080);
assert_eq!(selected_port(Some(u16::MAX)), u16::MAX);
// endregion:tests
    println!("__PASS__");
}
