# 课程 Rust 源码

本目录位于仓库根，与 `src/`、`scripts/` 同级，是独立的 Cargo workspace。每个 `NN-name/` 对应 `src/docs/NN-name/`；每章在自己的 `Cargo.toml` 中声明依赖，不维护集中 bin 列表。

- `src/bin/*.rs`：完整课时、可运行指南与编程参考答案，由 Cargo 自动发现。
- `starters/*.rs`：练习初始代码，可能含 `todo!()`，不参与验收构建。
- `snippets/*.rs`：题干或正文片段，可能故意无法编译，不参与验收构建。

Markdown 通过 `source=01-start/src/bin/hello.rs` 引用唯一源码。插件提供 `virtual:course-code/<相对路径>`；`?region=answer`、`?region=tests` 可导出同一文件的标记区段。题目答案、解析与匹配方式归属于对应 Markdown 的 `assessment` 元信息。详细约定见 [教材编写](../src/docs/README.md)。

从仓库根运行：

```sh
vp run verify:course
vp run verify:course:execution
vp run verify:course -- --concurrency 1
```

任务未命中 Vite+ 缓存时，验收一次批量编译后并发运行程序及断言；Cargo 缓存在 `node_modules/.cache/course/target`。报告保存在根目录 `.rust-path/reports/`。强制重新验收使用 `vp run --no-cache verify:course`。直接开发 Rust 时也可以执行 `cargo check --manifest-path course/Cargo.toml --workspace --bins`，或 `cargo run --manifest-path course/Cargo.toml --bin hello`。直接 Cargo 命令使用自己的默认 target 目录，不会与验收缓存互相覆盖。
