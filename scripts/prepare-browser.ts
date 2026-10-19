import { cp, mkdir, writeFile, access, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { logger, logReady } from './logger';

const started = performance.now();
const root = new URL('../', import.meta.url);

async function prepareBrowser() {
  logger.info('准备浏览器 Rust 编译器与分析资源…');
  await mkdir(new URL('public/runtime', root), { recursive: true });
  await cp(
    new URL('node_modules/@live-codes/wasm-rustc/bin', root),
    new URL('public/runtime/bin', root),
    { recursive: true },
  );
  await cp(
    new URL('node_modules/@live-codes/wasm-rustc/lib', root),
    new URL('public/runtime/lib', root),
    { recursive: true },
  );

  // 保留上游 worker，仅在 WASI 输出回调处增加流式消息，不修改编译器。
  let workerSource = await readFile(
    new URL('node_modules/@live-codes/rust-wasm/dist/worker.iife.debug.js', root),
    'utf8',
  );

  for (const channel of ['stdout', 'stderr']) {
    const original = `new ConsoleStdout((d) => ${channel}Chunks.push(d))`;

    if (!workerSource.includes(original)) {
      throw new Error('上游 Worker 输出接口已变化，需要更新流式适配');
    }

    workerSource = workerSource.replace(
      original,
      `new ConsoleStdout((d) => { ${channel}Chunks.push(d); self.postMessage({type:"output",channel:"${channel}",bytes:d}); })`,
    );
  }

  await writeFile(new URL('public/runtime/miri-worker.js', root), workerSource);
  const commit = '41cc4e4956017b0172c9cdd0b282c492b28458ea';

  const files = [
    'wasm_demo/wasm_demo.js',
    'wasm_demo/wasm_demo_bg.wasm',
    'wasm_demo/snippets/wasm-bindgen-rayon-7afa899f36665473/src/workerHelpers.js',
    'fake_std.rs',
    'fake_core.rs',
    'fake_alloc.rs',
  ];

  await Promise.all(
    files.map(async file => {
      const target = new URL(`public/analyzer/${file}`, root);

      try {
        await access(target);
        return;
      } catch {
        /* 只下载缺失的固定版本资源。 */
      }

      const response = await fetch(
        `https://raw.githubusercontent.com/Frank-III/ra-monaco-astro/${commit}/src/lib/${file}`,
      );

      if (!response.ok) {
        throw new Error(`Unable to download ${file}: ${response.status}`);
      }

      await mkdir(dirname(fileURLToPath(target)), { recursive: true });
      await writeFile(target, new Uint8Array(await response.arrayBuffer()));
      logger.info(`✓ analyzer/${file}`);
    }),
  );
  logger.info('✓ 浏览器 Rust 运行资源');
  logReady('browser runtime', started);
}

try {
  await prepareBrowser();
} catch (error) {
  logger.error(error instanceof Error ? (error.stack ?? error.message) : String(error));
  logReady('runtime', started, false);
  process.exitCode = 1;
}
