import { beforeEach, expect, test, vi } from 'vite-plus/test';

const stored = new Map<string, string>();

beforeEach(() => {
  vi.resetModules();
  stored.clear();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => stored.get(key) ?? null,
    setItem: (key: string, value: string) => stored.set(key, value),
    removeItem: (key: string) => stored.delete(key),
  });
  vi.stubGlobal('fetch', vi.fn());
});

const capabilities = () =>
  Response.json({ native: true, rustc: 'rustc test', cargo: 'cargo test' });

test('默认浏览器模式，不探测当前站点，也不发送执行请求', async () => {
  const native = await import('./native');
  await expect(native.detectNative()).resolves.toBe(false);
  await expect(native.nativeRequest('run', {})).rejects.toThrow('未配置');
  await expect(native.nativeRunStream({}, vi.fn())).rejects.toThrow('未配置');
  expect(fetch).not.toHaveBeenCalled();
  expect(native.nativeConnectionStatus.value).toBe('browser');
});

test('配置地址后统一请求该服务，并可清除配置恢复浏览器模式', async () => {
  vi.mocked(fetch).mockResolvedValue(capabilities());
  const native = await import('./native');
  native.configureNativeService(' http://127.0.0.1:3000/ ');
  expect(native.nativeServiceUrl.value).toBe('http://127.0.0.1:3000');
  expect(stored.get('rust-path:native-service')).toBe(native.nativeServiceUrl.value);
  await expect(native.detectNative()).resolves.toBe(true);
  expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:3000/api/capabilities', expect.any(Object));
  expect(native.nativeConnectionStatus.value).toBe('connected');
  native.configureNativeService('');
  await native.detectNative();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(native.nativeAvailable.value).toBe(false);
  expect(stored.has('rust-path:native-service')).toBe(false);
});

test('刷新后读取已保存地址，非法地址不会覆盖有效配置', async () => {
  stored.set('rust-path:native-service', 'http://localhost:3000');
  const native = await import('./native');
  expect(native.nativeServiceUrl.value).toBe('http://localhost:3000');
  expect(() => native.configureNativeService('javascript:alert(1)')).toThrow();
  expect(native.nativeServiceUrl.value).toBe('http://localhost:3000');
});

test('切换配置后迟到的旧服务响应不能覆盖新状态', async () => {
  let resolveOld!: (response: Response) => void;
  vi.mocked(fetch).mockImplementationOnce(
    () =>
      new Promise(resolve => {
        resolveOld = resolve;
      }),
  );
  const native = await import('./native');
  native.configureNativeService('http://localhost:3000');
  const old = native.detectNative();
  expect(native.nativeConnectionStatus.value).toBe('connecting');
  native.configureNativeService('');
  resolveOld(capabilities());
  await expect(old).resolves.toBe(false);
  expect(native.nativeAvailable.value).toBe(false);
  expect(native.nativeConnectionStatus.value).toBe('browser');
});

test('服务不可达时报告连接失败，允许下次重试', async () => {
  vi.mocked(fetch)
    .mockRejectedValueOnce(new TypeError('Failed to fetch'))
    .mockResolvedValueOnce(capabilities());
  const native = await import('./native');
  native.configureNativeService('http://localhost:3000');
  await expect(native.detectNative()).resolves.toBe(false);
  expect(native.nativeConnectionStatus.value).toBe('error');
  await expect(native.detectNative()).resolves.toBe(true);
  expect(native.nativeConnectionStatus.value).toBe('connected');
});
