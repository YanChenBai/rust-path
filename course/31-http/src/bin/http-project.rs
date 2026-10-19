// region:answer
fn api(method: &str, path: &str, body: &str) -> (u16, String) {
    match (method, path) {
        ("GET", "/health") => (200, String::from("ok")),
        ("POST", "/minutes") => {
            let n = serde_json::from_str::<serde_json::Value>(body)
                .ok()
                .and_then(|v| v.get("minutes").and_then(|n| n.as_u64()));
            match n {
                Some(n) if (1..=180).contains(&n) => (201, format!("saved:{n}")),
                _ => (400, String::from("invalid")),
            }
        }
        (_, "/health" | "/minutes") => (405, String::from("method")),
        _ => (404, String::from("missing")),
    }
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(api("GET","/health",""),(200,String::from("ok")));assert_eq!(api("POST","/minutes",r#"{"minutes":25}"#),(201,String::from("saved:25")));for input in ["bad",r#"{"minutes":0}"#,r#"{"minutes":181}"#,r#"{"minutes":1.5}"#,r#"{"minutes":"25"}"#]{assert_eq!(api("POST","/minutes",input).0,400);}assert_eq!(api("GET","/minutes","").0,405);assert_eq!(api("GET","/missing","").0,404);
// endregion:tests
    println!("__PASS__");
}
