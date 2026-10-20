// region:answer
fn import_batch(db: &mut rusqlite::Connection, values: &[i64]) -> Result<usize, String> {
    let tx = db.transaction().map_err(|e| e.to_string())?;
    for &n in values {
        if !(1..=180).contains(&n) {
            return Err(String::from("invalid"));
        }
        tx.execute("INSERT INTO logs(minutes) VALUES (?1)", [n])
            .map_err(|e| e.to_string())?;
    }
    tx.commit().map_err(|e| e.to_string())?;
    Ok(values.len())
}
// endregion:answer

fn main() {
    // region:tests
    let mut db = rusqlite::Connection::open_in_memory().unwrap();
    db.execute_batch(
        "CREATE TABLE logs(minutes INTEGER NOT NULL CHECK(minutes BETWEEN 1 AND 180));",
    )
    .unwrap();
    assert_eq!(import_batch(&mut db, &[25, 30]), Ok(2));
    assert!(import_batch(&mut db, &[40, 0, 50]).is_err());
    let total: i64 = db
        .query_row("SELECT SUM(minutes) FROM logs", [], |r| r.get(0))
        .unwrap();
    assert_eq!(total, 55);
    assert_eq!(import_batch(&mut db, &[]), Ok(0));
    db.execute_batch("DROP TABLE logs;").unwrap();
    assert!(import_batch(&mut db, &[20]).is_err());
    // endregion:tests
    println!("__PASS__");
}
