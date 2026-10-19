// region:answer
fn hours(minutes: u32) -> u32 { minutes / 60 }
// endregion:answer

fn main() {
// region:tests
for (a,b) in [(0,0),(59,0),(60,1),(90,1),(125,2),(600,10)] { assert_eq!(hours(a),b); }
// endregion:tests
    println!("__PASS__");
}
