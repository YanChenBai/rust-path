let rt = tokio::runtime::Runtime::new().unwrap();
assert_eq!(rt.____(minutes()), 25);
