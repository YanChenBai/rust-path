import { ref } from 'vue';

export const nativeAvailable = ref(false);

export const rustcVersion = ref<string | null>(null);

export const cargoVersion = ref<string | null>(null);
interface NativeCapabilities {
  native: boolean;
  rustc: string | null;
  cargo: string | null;
}
let probe: Promise<boolean> | undefined;

export async function nativeRequest<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${import.meta.env.BASE_URL}api/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(130000),
  });

  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('Nitro 服务尚未连接');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? '工具链请求失败');
  }

  return data as T;
}

export function detectNative() {
  probe ??= nativeRequest<NativeCapabilities>('capabilities', {})
    .then(data => {
      rustcVersion.value = data.rustc;
      cargoVersion.value = data.cargo;
      nativeAvailable.value = data.native;
      return data.native;
    })
    .catch(() => {
      nativeAvailable.value = false;
      rustcVersion.value = null;
      cargoVersion.value = null;
      return false;
    })
    .finally(() => {
      if (!nativeAvailable.value) {
        probe = undefined;
      }
    });
  return probe;
}

interface StreamMessage {
  type: 'output' | 'result' | 'error';
  channel?: 'stdout' | 'stderr';
  text?: string;
  message?: string;
  success?: boolean;
  stdout?: string;
  stderr?: string;
  elapsed?: number;
}

export async function nativeRunStream(
  body: unknown,
  onOutput: (channel: 'stdout' | 'stderr', text: string) => void,
): Promise<{ success: boolean; stdout: string; stderr: string; elapsed: number }> {
  const response = await fetch(`${import.meta.env.BASE_URL}api/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...(body as object), stream: true }),
    signal: AbortSignal.timeout(130000),
  });

  if (!response.ok || !response.body) {
    throw new Error('无法启动流式执行，请检查本地工具链服务。');
  }

  if (!response.headers.get('content-type')?.includes('application/x-ndjson')) {
    throw new Error('当前服务不支持流式执行，请刷新开发服务。');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let result: { success: boolean; stdout: string; stderr: string; elapsed: number } | undefined;

  function consume(line: string) {
    if (!line.trim()) {
      return;
    }

    const message = JSON.parse(line) as StreamMessage;

    if (message.type === 'error') {
      throw new Error(message.message ?? '执行失败');
    }

    if (message.type === 'output') {
      onOutput(message.channel ?? 'stdout', message.text ?? '');
    }

    if (message.type === 'result') {
      result = {
        success: message.success === true,
        stdout: message.stdout ?? '',
        stderr: message.stderr ?? '',
        elapsed: message.elapsed ?? 0,
      };
    }
  }

  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      let index = buffer.indexOf('\n');

      while (index >= 0) {
        consume(buffer.slice(0, index));
        buffer = buffer.slice(index + 1);
        index = buffer.indexOf('\n');
      }

      if (done) {
        break;
      }
    }

    consume(buffer);

    if (!result) {
      throw new Error('输出连接中断，程序没有返回结束状态。');
    }

    return result;
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
