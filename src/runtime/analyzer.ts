let worker: Worker | undefined;
let sequence = 0;

const pending = new Map<
  number,
  { resolve: (value: unknown) => void; reject: (error: Error) => void }
>();

export function analyze<T>(method: string, code: string, ...args: unknown[]): Promise<T> {
  if (!worker) {
    worker = new Worker(`${import.meta.env.BASE_URL}analyzer/worker.js`, { type: 'module' });

    worker.onmessage = ({ data }) => {
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

    worker.onerror = () => {
      for (const request of pending.values()) {
        request.reject(new Error('语义引擎加载失败'));
      }

      pending.clear();
      worker?.terminate();
      worker = undefined;
    };
  }

  return new Promise((resolve, reject) => {
    const id = ++sequence;

    const timer = setTimeout(() => {
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
