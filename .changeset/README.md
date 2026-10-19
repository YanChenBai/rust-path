# 版本说明

前端和 Rust server 共用根 `package.json` 的版本。运行 `vp run changeset`，选择 `rust-study` 并填写变更说明；只写一次前后端共用的版本记录。

合并到 `master` 后，Actions 会维护 Release PR，同步 `package.json`、`Cargo.toml`、`Cargo.lock` 和 `CHANGELOG.md`。合并 Release PR 后，自动发布 server 二进制并部署 Cloudflare Pages。无需手动创建 tag，也不发布 npm 或 crates.io 包。

本地验证与仓库配置见 [发布指南](../docs/development.md#版本与自动发布)。
