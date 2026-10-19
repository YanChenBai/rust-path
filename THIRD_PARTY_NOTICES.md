# Third-party runtime resources

The course text, examples and practice tasks in this repository are original educational material informed by the official Rust Book, Rust by Example, and Rustlings. This is not an official Rust course.

## Browser execution

- `@live-codes/rust-wasm` 0.3.0: https://www.npmjs.com/package/@live-codes/rust-wasm
- `@live-codes/wasm-rustc` 0.1.0: WebAssembly Miri and Rust sysroot, derived from bjorn3's Rust-to-WASI work and LyonSyonII/rubri. Rust/Miri are MIT OR Apache-2.0; rubri is MIT.
- Runtime package documentation records that these are historical 2024-era artifacts, not a newly built or fully reproducible modern Rust distribution. Undefined-behavior checking is disabled in this Miri build. This app uses it for introductory program evaluation, not soundness verification.

## Browser analysis

Resources are restored from the fixed commit `41cc4e4956017b0172c9cdd0b282c492b28458ea` of https://github.com/Frank-III/ra-monaco-astro :

- `src/lib/wasm_demo/wasm_demo.js`, `wasm_demo_bg.wasm`
- Generated wasm-bindgen-rayon helper, retaining the Google Apache-2.0 notice in its source.
- `fake_std.rs`, `fake_core.rs`, `fake_alloc.rs`: standard-library analysis stubs.

The underlying analyzer is the historical rust-analyzer WASM demo (https://github.com/rust-analyzer/rust-analyzer-wasm). Rust-analyzer is MIT OR Apache-2.0. The adapter in `public/analyzer/worker.js` and the Vue integration are authored for this project. These artifacts provide an experimental subset of modern rust-analyzer features and require a cross-origin isolated page.

Downloaded/generated resources are ignored in Git. `scripts/prepare-runtime.mjs` restores them for same-origin static hosting. The app does not send learner code to these projects or a remote execution API.

Monaco Editor: MIT. Vue: MIT. Tailwind CSS: MIT. motion-v: MIT. Lucide icons: ISC. Consult each installed package for full license texts.
