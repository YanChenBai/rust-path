// region:answer
fn total_minutes(db: &rusqlite::Connection) -> rusqlite::Result<i64> {
    db.query_row("SELECT COALESCE(SUM(minutes),0) FROM logs", [], |r| {
        r.get(0)
    })
}
// endregion:answer

fn main() {
// region:tests
let db = rusqlite::Connection::open_in_memory().unwrap();
    db.execute_batch("CREATE TABLE logs(minutes INTEGER NOT NULL);")
        .unwrap();
    assert_eq!(total_minutes(&db).unwrap(), 0);
    db.execute_batch("INSERT INTO logs VALUES (25),(30);")
        .unwrap();
    assert_eq!(total_minutes(&db).unwrap(), 55);
// endregion:tests
    println!("__PASS__");
}
