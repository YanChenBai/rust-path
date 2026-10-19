use clap::Parser;

#[derive(Parser)]

struct Args {
    #[arg(long)]
    json: String,
}

#[derive(serde::Serialize, serde::Deserialize)]

#[serde(deny_unknown_fields)]

struct Record {
    name: String,
    minutes: u32,
}

#[derive(Debug, thiserror::Error)]

enum RecordError {
    #[error("名字不能为空")]
    EmptyName,
    #[error("分钟必须为 1..=180")]
    InvalidMinutes,
}

fn validate(record: &Record) -> Result<(), RecordError> {
    todo!()
}

fn execute(args: &[&str]) -> anyhow::Result<String> {
    todo!()
}

fn main() {
    println!(
        "{:?}",
        execute(&["study", "--json", r#"{"name":"甲","minutes":25}"#])
    );
}
