import { ref } from 'vue';

import { detectNative, nativeRequest, nativeRunStream } from './native';
import { beginResourceLoading } from './resource-loading';

export const runtimeStatus = ref('浏览器 Rust · 待加载');

export interface RunResult {
  success: boolean;
  stdout: string;
  stderr: string;
  elapsed: number;
  transcript?: string;
}
interface WorkerResult {
  type: string;
  id?: number;
  stdout?: string;
  stderr?: string;
  exitCode?: number;
  durationMs?: number;
  message?: string;
  completed?: number;
  total?: number;
  loaded?: number;
  channel?: 'stdout' | 'stderr';
  bytes?: Uint8Array;
}
let worker: Worker | undefined;
let sequence = 0;
let running = false;
let nativeRequestId: string | undefined;
let runtimeLoading: ReturnType<typeof beginResourceLoading> | undefined;
let browserReady = false;

export interface RunOptions {
  mode?: 'run' | 'check' | 'build' | 'test';
  dependencies?: string[];
  nativeRequired?: boolean;
  onOutput?: (channel: 'stdout' | 'stderr', text: string) => void;
}

let pending:
  | {
      resolve: (result: RunResult) => void;
      reject: (error: Error) => void;
      timer: ReturnType<typeof setTimeout>;
      onOutput?: RunOptions['onOutput'];
      decoders: { stdout: TextDecoder; stderr: TextDecoder };
    }
  | undefined;

export async function runRust(code: string, options: RunOptions = {}): Promise<RunResult> {
  if (await detectNative()) {
    if (running) {
      throw new Error('已有任务运行，请等待完成');
    }

    running = true;
    nativeRequestId = crypto.randomUUID();

    try {
      const body = {
        code,
        mode: options.mode,
        dependencies: options.dependencies,
        requestId: nativeRequestId,
      };

      if (options.onOutput) {
        return await nativeRunStream(body, options.onOutput);
      }

      return await nativeRequest<RunResult>('run', body);
    } finally {
      running = false;
      nativeRequestId = undefined;
    }
  }

  if (options.nativeRequired || options.dependencies?.length) {
    throw new Error('这个示例需要连接本机 Rust 增强服务，浏览器模式暂不支持。');
  }

  if (running) {
    throw new Error('另一段代码正在运行，请等待完成。');
  }

  running = true;

  if (!worker) {
    runtimeLoading?.dispose();
    runtimeLoading = beginResourceLoading('runtime', '加载浏览器 Rust 工具链');
    browserReady = false;

    try {
      worker = new Worker(`${import.meta.env.BASE_URL}runtime/miri-worker.js`);
    } catch (error) {
      const message = error instanceof Error ? error.message : '无法启动浏览器 Rust 引擎';
      fail(message);
      throw error;
    }

    worker.onmessage = ({ data }: MessageEvent<WorkerResult>) => {
      if (data.type === 'output' && pending && data.bytes) {
        const channel = data.channel ?? 'stdout';
        pending.onOutput?.(channel, pending.decoders[channel].decode(data.bytes, { stream: true }));
      }

      if (data.type === 'progress') {
        runtimeStatus.value = `加载 Rust 工具链 ${data.loaded ?? 0}/${data.total ?? '…'}`;
        runtimeLoading?.progress(data.loaded ?? 0, data.total ?? 0);

        if (data.total && data.loaded === data.total) {
          runtimeLoading?.stage('初始化浏览器 Rust 引擎');
        }
      }

      if (data.type === 'ready') {
        runtimeStatus.value = 'Rust · 浏览器就绪';
        browserReady = true;
        runtimeLoading?.ready('浏览器 Rust 已就绪');
      }

      if (data.type === 'result' && pending) {
        for (const channel of ['stdout', 'stderr'] as const) {
          const text = pending.decoders[channel].decode();

          if (text) {
            pending.onOutput?.(channel, text);
          }
        }

        clearTimeout(pending.timer);
        pending.resolve({
          success: data.exitCode === 0,
          stdout: data.stdout ?? '',
          stderr: data.stderr ?? '',
          elapsed: data.durationMs ?? 0,
        });
        pending = undefined;
        running = false;
      }

      if (['error', 'run-error'].includes(data.type)) {
        fail(data.message ?? 'Rust 引擎加载失败');
      }
    };

    worker.onerror = event => fail(event.message || '浏览器无法启动 Rust 引擎');
    worker.postMessage({
      type: 'init',
      toolchain: {
        baseUrl: new URL(`${import.meta.env.BASE_URL}runtime`, location.origin).href,
        gzipped: false,
      },
    });
  }

  runtimeStatus.value = '准备编译与执行…';
  return new Promise((resolve, reject) => {
    pending = {
      resolve,
      reject,
      onOutput: options.onOutput,
      decoders: { stdout: new TextDecoder(), stderr: new TextDecoder() },
      timer: setTimeout(
        () => fail('运行超时（60 秒）。已停止 Worker，请检查无限循环或重新运行。'),
        60000,
      ),
    };
    worker!.postMessage({ type: 'run', id: ++sequence, code });
  });
}

function fail(message: string) {
  if (browserReady) {
    runtimeLoading?.dispose();
  } else {
    runtimeLoading?.fail(message);
  }

  if (pending) {
    clearTimeout(pending.timer);
    pending.reject(new Error(message));
    pending = undefined;
  }

  worker?.terminate();
  worker = undefined;
  running = false;
  runtimeStatus.value = 'Rust · 点击运行重试';
}

export function stopRust() {
  if (nativeRequestId) {
    void nativeRequest('stop', { requestId: nativeRequestId }).catch(error => {
      runtimeStatus.value = error instanceof Error ? error.message : '停止请求失败，请稍后重试';
    });
    return;
  }

  runtimeLoading?.dispose();
  runtimeLoading = undefined;
  fail('执行已停止。');
}
