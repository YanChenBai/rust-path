import { ref } from 'vue';

import { beginResourceLoading } from './resource-loading';

export const nativeAvailable = ref(false);

export const rustcVersion = ref<string | null>(null);

export const cargoVersion = ref<string | null>(null);
interface NativeCapabilities {
  native: boolean;
  rustc: string | null;
  cargo: string | null;
}
let probe: Promise<boolean> | undefined;
const serviceKey = 'rust-path:native-service';

function savedServiceUrl() {
  try {
    const value = localStorage.getItem(serviceKey);
    return value ? normalizeServiceUrl(value) : '';
  } catch {
    return '';
  }
}

function normalizeServiceUrl(value: string) {
  if (!value.trim()) {
    return '';
  }

  const url = new URL(value.trim());

  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error('请输入不含账号、查询参数或片段的 HTTP / HTTPS 服务地址');
  }

  return url.href.replace(/\/+$/, '');
}

export const nativeServiceUrl = ref(savedServiceUrl());

export const nativeConnectionStatus = ref<
  'browser' | 'disconnected' | 'connecting' | 'connected' | 'error'
>(nativeServiceUrl.value ? 'disconnected' : 'browser');

export function configureNativeService(value: string) {
  const url = normalizeServiceUrl(value);

  // 先持久化；存储失败时不切换到无法保存的配置。
  if (url) {
    localStorage.setItem(serviceKey, url);
  } else {
    localStorage.removeItem(serviceKey);
  }

  nativeServiceUrl.value = url;
  nativeConnectionStatus.value = url ? 'disconnected' : 'browser';
  probe = undefined;
  nativeAvailable.value = false;
  rustcVersion.value = null;
  cargoVersion.value = null;
}

function serviceApiUrl(path: string, endpoint: string) {
  if (!endpoint) {
    throw new Error('未配置本机增强服务，当前使用浏览器模式');
  }

  return `${endpoint}/api/${path}`;
}

export async function nativeRequest<T>(
  path: string,
  body: unknown,
  endpoint = nativeServiceUrl.value,
): Promise<T> {
  const response = await fetch(serviceApiUrl(path, endpoint), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(path === 'capabilities' ? 2000 : 130000),
  });

  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('本机 Rust 服务未返回有效响应');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? '工具链请求失败');
  }

  return data as T;
}

export function detectNative() {
  const endpoint = nativeServiceUrl.value;

  if (!endpoint) {
    return Promise.resolve(false);
  }

  if (probe) {
    return probe;
  }

  const loading = beginResourceLoading('runtime', '检测本机 Rust 服务');
  nativeConnectionStatus.value = 'connecting';

  const currentProbe = nativeRequest<NativeCapabilities>('capabilities', {}, endpoint)
    .then(data => {
      if (probe !== currentProbe) {
        return false;
      }

      rustcVersion.value = data.rustc;
      cargoVersion.value = data.cargo;
      nativeAvailable.value = data.native;
      nativeConnectionStatus.value = data.native ? 'connected' : 'error';
      loading.dispose();
      return data.native;
    })
    .catch(() => {
      if (probe !== currentProbe) {
        return false;
      }

      nativeAvailable.value = false;
      nativeConnectionStatus.value = 'error';
      rustcVersion.value = null;
      cargoVersion.value = null;
      return false;
    })
    .finally(() => {
      loading.dispose();

      if (probe === currentProbe && !nativeAvailable.value) {
        probe = undefined;
      }
    });

  probe = currentProbe;
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
  const response = await fetch(serviceApiUrl('run', nativeServiceUrl.value), {
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
