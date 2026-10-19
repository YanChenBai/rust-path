import { beginResourceLoading } from './resource-loading';

let worker: Worker | undefined;
let sequence = 0;
let loading: ReturnType<typeof beginResourceLoading> | undefined;
let initialized = false;

const pending = new Map<
  number,
  { resolve: (value: unknown) => void; reject: (error: Error) => void }
>();

export function analyze<T>(method: string, code: string, ...args: unknown[]): Promise<T> {
  if (!worker) {
    loading?.dispose();
    loading = beginResourceLoading('editor', '加载浏览器语义引擎', 6);
    initialized = false;

    try {
      worker = new Worker(`${import.meta.env.BASE_URL}analyzer/worker.js`, { type: 'module' });
    } catch (error) {
      loading.fail(error instanceof Error ? error.message : '语义引擎加载失败');
      return Promise.reject(error);
    }

    worker.onmessage = ({ data }) => {
      if (data.type === 'progress') {
        loading?.progress(data.completed, data.total);
        return;
      }

      if (data.type === 'ready') {
        initialized = true;
        loading?.ready('浏览器语义引擎已就绪');
        return;
      }

      if (data.type === 'error') {
        failWorker(data.message);
        return;
      }

      const request = pending.get(data.id);

      if (!request) {
        return;
      }

      if (data.error) {
        request.reject(new Error(data.error));
      } else {
        request.resolve(data.result);
      }

      pending.delete(data.id);
    };

    worker.onerror = () => failWorker('语义引擎加载失败');
  }

  return new Promise((resolve, reject) => {
    const id = ++sequence;

    const timer = setTimeout(() => {
      if (!initialized) {
        failWorker('语义引擎加载超时');
        return;
      }

      pending.delete(id);
      reject(new Error('语义分析超时'));
    }, 60000);

    pending.set(id, {
      resolve: value => {
        clearTimeout(timer);
        resolve(value as T);
      },
      reject: error => {
        clearTimeout(timer);
        reject(error);
      },
    });
    worker!.postMessage({ id, method, code, args });
  });
}

function failWorker(message: string) {
  loading?.fail(message);

  for (const request of pending.values()) {
    request.reject(new Error(message));
  }

  pending.clear();
  worker?.terminate();
  worker = undefined;
}
