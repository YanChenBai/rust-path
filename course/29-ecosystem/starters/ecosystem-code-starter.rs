#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq)]

#[serde(deny_unknown_fields)]

struct Entry {
    name: String,
    minutes: u32,
}

fn decode(input: &str) -> anyhow::Result<Entry> {
    todo!()
}

fn main() {
    println!("{:?}", decode(r#"{"name":"小林","minutes":25}"#));
}
