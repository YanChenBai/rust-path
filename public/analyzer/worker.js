import init, { initThreadPool, WorldState } from './wasm_demo/wasm_demo.js';
let state;

const ready = (async () => {
  await init();
  await initThreadPool(2);
  state = new WorldState();

  const sources = await Promise.all(
    ['fake_std.rs', 'fake_core.rs', 'fake_alloc.rs'].map(async file => {
      const response = await fetch(new URL(file, import.meta.url));

      if (!response.ok) {
        throw new Error(`Failed to load ${file}`);
      }

      return response.text();
    }),
  );

  state.init('fn main() {}', ...sources);
})();

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
