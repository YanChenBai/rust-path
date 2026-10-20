mod config {
    ____ fn port() -> u16 {
        8080
    }
}

fn main() {
    println!("{}", config::port());
}
