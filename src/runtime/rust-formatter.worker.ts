import { format, init } from '@scalar/rust-fmt';

// 包的默认类型入口面向 Node；Vite 在 Worker 中选择 browser 入口。
const initialize = init as (options: { url: string; encoding: 'none' }) => Promise<void>;

const ready = initialize({
  url: `${import.meta.env.BASE_URL}runtime/rustfmt.wasm`,
  encoding: 'none',
});

void ready.catch(() => {});

self.onmessage = async ({ data }: MessageEvent<{ code: string }>) => {
  try {
    await ready;

    const code = await format(data.code, { edition: '2024', styleEdition: '2024' });
    self.postMessage({ code });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : 'Rust 格式化失败' });
  }
};
