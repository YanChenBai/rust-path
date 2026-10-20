export function adaptRuntimeWorker(input: string) {
  let source = input.replace(/\r\n/g, '\n');
  const start = source.indexOf('  async function decompress(stream, gzipped) {');
  const end = source.indexOf('  async function openCache()', start);

  if (start < 0 || end < 0) {
    throw new Error('上游 Worker 解压接口已变化，需要更新工具链加载适配');
  }

  // Fetch 可能已按 Content-Encoding 解压，不能仅根据文件后缀再次解压。
  source = `${source.slice(0, start)}  async function decompress(stream, gzipped) {
    if (!gzipped) return stream;
    const reader = stream.getReader();
    const prefix = [];
    const chunks = [];
    while (prefix.length < 2) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      for (const byte of value) {
        prefix.push(byte);
        if (prefix.length === 2) break;
      }
    }
    const body = new ReadableStream({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(chunk);
      },
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) controller.close();
        else controller.enqueue(value);
      },
      cancel(reason) { return reader.cancel(reason); }
    });
    if (prefix[0] !== 0x1f || prefix[1] !== 0x8b) return body;
    return body.pipeThrough(new DecompressionStream("gzip"));
  }
${source.slice(end)}`;

  const cached = `        const bytes = await decompress(hit.body, toolchain2.gzipped).then(readAll);
        return { bytes, cached: true };`;

  if (!source.includes(cached)) {
    throw new Error('上游 Worker 缓存接口已变化，需要更新工具链加载适配');
  }

  source = source.replace(
    cached,
    `        try {
          const bytes = await decompress(hit.body, toolchain2.gzipped).then(readAll);
          return { bytes, cached: true };
        } catch {
          await cache.delete(url);
        }`,
  );

  return source;
}
