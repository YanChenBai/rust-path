// region:answer
fn insert_name(db: &rusqlite::Connection, name: &str) -> rusqlite::Result<usize> {
    db.execute("INSERT INTO names(value) VALUES (?1)", [name])
}
// endregion:answer

fn main() {
// region:tests
let db = rusqlite::Connection::open_in_memory().unwrap();
    db.execute_batch("CREATE TABLE names(value TEXT NOT NULL);")
        .unwrap();
    assert_eq!(insert_name(&db, "Ada's Rust").unwrap(), 1);
    let s: String = db
        .query_row("SELECT value FROM names", [], |r| r.get(0))
        .unwrap();
    assert_eq!(s, "Ada's Rust");
    assert_eq!(insert_name(&db, "'); DROP TABLE names; --").unwrap(), 1);
// endregion:tests
    println!("__PASS__");
}
