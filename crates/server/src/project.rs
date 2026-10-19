use anyhow::{Result, bail};
use std::path::{Path, PathBuf};
use tempfile::TempDir;
use tokio::fs;
use uuid::Uuid;

pub const DEPENDENCIES: &[(&str, &str)] = &[
    (
        "tokio",
        "tokio = { version = \"1\", features = [\"full\"] }",
    ),
    (
        "serde",
        "serde = { version = \"1\", features = [\"derive\"] }",
    ),
    ("serde_json", "serde_json = \"1\""),
    ("anyhow", "anyhow = \"1\""),
    ("thiserror", "thiserror = \"2\""),
    (
        "reqwest",
        "reqwest = { version = \"0.12\", default-features = false, features = [\"json\", \"rustls-tls\"] }",
    ),
    (
        "clap",
        "clap = { version = \"4\", features = [\"derive\"] }",
    ),
    ("tracing", "tracing = \"0.1\""),
    (
        "rusqlite",
        "rusqlite = { version = \"0.37\", features = [\"bundled\"] }",
    ),
];

pub fn validate_code(code: &str) -> Result<()> {
    if code.chars().count() > 100_000 {
        bail!("代码不能超过 100000 字符");
    }
    Ok(())
}

pub fn manifest(selected: &[String]) -> Result<String> {
    let mut entries = Vec::new();
    for name in selected {
        let Some((_, entry)) = DEPENDENCIES.iter().find(|(key, _)| key == name) else {
            bail!("不支持的依赖：{name}");
        };
        if !entries.contains(entry) {
            entries.push(*entry);
        }
    }
    Ok(format!(
        "[package]\nname = \"rust_path_scratch\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\n{}\n\n[[bin]]\nname = \"rust_path_{}\"\npath = \"src/main.rs\"\n",
        entries.join("\n"),
        Uuid::new_v4().simple()
    ))
}

pub struct Project {
    directory: TempDir,
}

impl Project {
    pub async fn create(code: &str, selected: &[String]) -> Result<Self> {
        validate_code(code)?;
        let config = manifest(selected)?;
        let directory = tempfile::Builder::new().prefix("rust-path-").tempdir()?;
        fs::create_dir(directory.path().join("src")).await?;
        fs::write(directory.path().join("Cargo.toml"), config).await?;
        fs::write(directory.path().join("src/main.rs"), code).await?;
        Ok(Self { directory })
    }

    pub fn path(&self) -> &Path {
        self.directory.path()
    }

    pub fn source(&self) -> PathBuf {
        self.path().join("src/main.rs")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn reject_unknown_dependencies_and_deduplicate() {
        assert!(manifest(&["arbitrary = \"*\"".into()]).is_err());
        let output = manifest(&["tokio".into(), "tokio".into()]).unwrap();
        assert_eq!(output.matches("tokio =").count(), 1);
        assert!(output.contains("edition = \"2024\""));
    }
}
