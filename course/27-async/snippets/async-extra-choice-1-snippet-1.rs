use std::cell::Cell;
let count = Cell::new(0);
let job = async { count.set(5); };
