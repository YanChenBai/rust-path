export function formatRust(code: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // 每次请求独立运行，超时或完成后释放 WASM 内存。
    const worker = new Worker(new URL('./rust-formatter.worker.ts', import.meta.url), {
      type: 'module',
    });

    const finish = () => {
      clearTimeout(timer);
      worker.terminate();
    };

    const timer = setTimeout(() => {
      finish();
      reject(new Error('格式化超时，请重试。'));
    }, 30000);

    worker.onmessage = ({ data }: MessageEvent<{ code?: string; error?: string }>) => {
      finish();

      if (data.error || typeof data.code !== 'string') {
        reject(new Error(data.error || '格式化未返回代码。'));
        return;
      }

      resolve(data.code);
    };

    worker.onerror = () => {
      finish();
      reject(new Error('无法加载 Rust 格式化器，请重试。'));
    };

    worker.postMessage({ code });
  });
}
