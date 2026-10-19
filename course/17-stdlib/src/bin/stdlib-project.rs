// region:answer
fn classify_rows(rows: &[Option<Result<u32, String>>]) -> (usize, usize, usize) {
    let (mut valid, mut missing, mut invalid) = (0, 0, 0);
    for row in rows {
        match row {
            Some(Ok(1..=180)) => valid += 1,
            None => missing += 1,
            _ => invalid += 1,
        }
    }
    (valid, missing, invalid)
}
// endregion:answer

fn main() {
// region:tests
let rows=vec![Some(Ok(1)),None,Some(Err(String::from("bad"))),Some(Ok(0)),Some(Ok(181)),Some(Ok(180))];assert_eq!(classify_rows(&rows),(2,1,3));assert_eq!(rows.len(),6);assert_eq!(classify_rows(&[]),(0,0,0));
// endregion:tests
    println!("__PASS__");
}
