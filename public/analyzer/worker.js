import init, { initThreadPool, WorldState } from './wasm_demo/wasm_demo.js';
let state;

const ready = (async () => {
  let completed = 0;
  const progress = () => self.postMessage({ type: 'progress', completed: ++completed, total: 6 });
  await init();
  progress();
  await initThreadPool(2);
  progress();
  state = new WorldState();

  const sources = await Promise.all(
    ['fake_std.rs', 'fake_core.rs', 'fake_alloc.rs'].map(async file => {
      const response = await fetch(new URL(file, import.meta.url));

      if (!response.ok) {
        throw new Error(`Failed to load ${file}`);
      }

      const source = await response.text();
      progress();
      return source;
    }),
  );

  state.init('fn main() {}', ...sources);
  progress();
  self.postMessage({ type: 'ready' });
})();

// 在首个分析请求到达前也上报初始化失败，避免进度停在加载中。
void ready.catch(error => self.postMessage({ type: 'error', message: error.message }));

self.onmessage = async ({ data }) => {
  try {
    await ready;
    const updated = state.update(data.code ?? data.args[0]);
    const result = data.method === 'update' ? updated : state[data.method](...data.args);
    self.postMessage({ id: data.id, result });
  } catch (error) {
    self.postMessage({ id: data.id, error: error.message });
  }
};
