import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { gzipSync } from 'node:zlib';

import { describe, expect, it, vi } from 'vite-plus/test';

import { adaptRuntimeWorker } from './runtime-worker';

const upstream = readFileSync(
  new URL('../node_modules/@live-codes/rust-wasm/dist/worker.iife.debug.js', import.meta.url),
  'utf8',
);

function loader(fetch = vi.fn()) {
  const source = adaptRuntimeWorker(upstream);
  const start = source.indexOf('  function artifactUrl(');
  const end = source.indexOf('  async function loadToolchain(');
  return runInNewContext(`${source.slice(start, end)}; ({decompress, fetchArtifact})`, {
    ReadableStream,
    Uint8Array,
    DecompressionStream,
    fetch,
    caches: {},
    setTimeout,
  }) as {
    decompress(stream: ReadableStream, gzipped: boolean): Promise<ReadableStream>;
    fetchArtifact(
      cache: unknown,
      toolchain: unknown,
      file: string,
      attempts: number,
    ): Promise<{ bytes: Uint8Array; cached: boolean }>;
  };
}

const wasm = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]);

const bytes = async (stream: ReadableStream) =>
  new Uint8Array(await new Response(stream).arrayBuffer());

describe('浏览器工具链解压', () => {
  it('同时支持 gzip 文件和浏览器按 Content-Encoding 解压后的响应', async () => {
    const runtime = loader();

    for (const body of [gzipSync(wasm), wasm]) {
      const result = await runtime.decompress(new Response(body).body!, true);
      expect(await bytes(result)).toEqual(wasm);
    }
  });

  it('gzip 标识跨网络分块仍能正确识别', async () => {
    const compressed = gzipSync(wasm);

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(compressed.subarray(0, 1));
        controller.enqueue(compressed.subarray(1));
        controller.close();
      },
    });

    expect(await bytes(await loader().decompress(stream, true))).toEqual(wasm);
  });

  it('损坏的 gzip 缓存会删除并重新下载，已解压缓存可以直接读取', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(wasm));

    const cache = {
      match: vi.fn().mockResolvedValue(new Response(new Uint8Array([31, 139, 0, 0]))),
      delete: vi.fn().mockResolvedValue(true),
      put: vi.fn().mockResolvedValue(undefined),
    };

    const toolchain = { baseUrl: 'https://example.test', gzipped: true };
    const result = await loader(fetch).fetchArtifact(cache, toolchain, 'miri.wasm', 1);
    expect(result.bytes).toEqual(wasm);
    expect(cache.delete).toHaveBeenCalledWith('https://example.test/miri.wasm.gz');
    expect(fetch).toHaveBeenCalledTimes(1);

    cache.match.mockResolvedValue(new Response(wasm));
    const cached = await loader(fetch).fetchArtifact(cache, toolchain, 'miri.wasm', 1);
    expect(cached.bytes).toEqual(wasm);
    expect(cached.cached).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
