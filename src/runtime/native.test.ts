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
  Response.json({
    native: true,
    analyzer: 'rust-analyzer 1.96.0 (test)',
    cargo: 'cargo 1.96.0 (test)',
    rustc: 'rustc 1.96.0 (test)',
  });

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
  expect(native.analyzerVersion.value).toBe('rust-analyzer 1.96.0 (test)');
  expect(native.cargoVersion.value).toBe('cargo 1.96.0 (test)');
  expect(native.rustcVersion.value).toBe('rustc 1.96.0 (test)');
  native.configureNativeService('');
  await native.detectNative();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(native.nativeAvailable.value).toBe(false);
  expect(native.analyzerVersion.value).toBeNull();
  expect(native.cargoVersion.value).toBeNull();
  expect(native.rustcVersion.value).toBeNull();
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
  expect(native.analyzerVersion.value).toBeNull();
  expect(native.cargoVersion.value).toBeNull();
  expect(native.rustcVersion.value).toBeNull();
});

test('并发探测和已连接后的探测复用同一请求', async () => {
  vi.mocked(fetch).mockResolvedValue(capabilities());
  const native = await import('./native');
  native.configureNativeService('http://localhost:3000');
  const first = native.detectNative();
  expect(native.detectNative()).toBe(first);
  await first;
  await native.detectNative();
  expect(fetch).toHaveBeenCalledTimes(1);
});

test('切换端点立即清空版本，迟到响应不能覆盖新服务版本', async () => {
  let resolveOld!: (response: Response) => void;
  vi.mocked(fetch)
    .mockResolvedValueOnce(capabilities())
    .mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolveOld = resolve;
        }),
    )
    .mockResolvedValueOnce(Response.json({ native: true, cargo: 'cargo new' }));
  const native = await import('./native');
  native.configureNativeService('http://localhost:3000');
  await native.detectNative();
  native.configureNativeService('http://localhost:3001');
  expect(native.analyzerVersion.value).toBeNull();
  expect(native.cargoVersion.value).toBeNull();
  expect(native.rustcVersion.value).toBeNull();
  expect(native.nativeConnectionStatus.value).toBe('disconnected');
  const old = native.detectNative();
  native.configureNativeService('http://localhost:3002');
  await native.detectNative();
  resolveOld(capabilities());
  await expect(old).resolves.toBe(false);
  expect(native.analyzerVersion.value).toBeNull();
  expect(native.cargoVersion.value).toBe('cargo new');
  expect(native.rustcVersion.value).toBeNull();
});

test.each([
  { native: true },
  { native: true, analyzer: null, cargo: '', rustc: '  ' },
  { native: true, analyzer: false, cargo: 123, rustc: {} },
  { native: false, analyzer: 'old analyzer', cargo: 'old cargo', rustc: 'old rustc' },
])('不可用的工具链版本不保留：%j', async data => {
  vi.mocked(fetch).mockResolvedValue(Response.json(data));
  const native = await import('./native');
  native.configureNativeService('http://localhost:3000');
  await expect(native.detectNative()).resolves.toBe(data.native);
  expect(native.analyzerVersion.value).toBeNull();
  expect(native.cargoVersion.value).toBeNull();
  expect(native.rustcVersion.value).toBeNull();
});

test('重新连接失败后清空之前成功连接的版本', async () => {
  vi.mocked(fetch)
    .mockResolvedValueOnce(capabilities())
    .mockRejectedValueOnce(new TypeError('Failed to fetch'));
  const native = await import('./native');
  native.configureNativeService('http://localhost:3000');
  await native.detectNative();
  native.configureNativeService('http://localhost:3000');
  await expect(native.detectNative()).resolves.toBe(false);
  expect(native.nativeConnectionStatus.value).toBe('error');
  expect(native.analyzerVersion.value).toBeNull();
  expect(native.cargoVersion.value).toBeNull();
  expect(native.rustcVersion.value).toBeNull();
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
