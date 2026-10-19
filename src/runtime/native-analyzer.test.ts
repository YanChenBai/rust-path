import { afterEach, expect, test, vi } from 'vite-plus/test';

import { nativeRequest } from './native';
import { NativeAnalyzer } from './native-analyzer';
import { resourceTasks } from './resource-loading';

vi.mock('./native', () => ({
  nativeServiceUrl: { value: 'http://127.0.0.1:3000' },
  nativeRequest: vi.fn(),
}));

afterEach(() => {
  resourceTasks.clear();
  vi.clearAllMocks();
  vi.useRealTimers();
});

test('握手后继续显示索引进度，后台工作结束才完成', async () => {
  vi.useFakeTimers();
  vi.mocked(nativeRequest)
    .mockResolvedValueOnce({ id: 'session' })
    .mockResolvedValueOnce({
      ready: false,
      health: 'ok',
      tasks: [{ title: 'Indexing', percentage: 23 }],
    })
    .mockResolvedValueOnce({ ready: true, health: 'ok', tasks: [] })
    .mockResolvedValue({});
  const analyzer = new NativeAnalyzer();
  const opened = analyzer.open('fn main() {}', []);
  await vi.advanceTimersByTimeAsync(200);
  const task = [...resourceTasks.values()][0]!;
  expect(task).toMatchObject({
    status: 'loading',
    label: 'Indexing',
    completed: 23,
    total: 100,
    visible: true,
  });
  await vi.advanceTimersByTimeAsync(50);
  await opened;
  expect(task.status).toBe('ready');
  await vi.advanceTimersByTimeAsync(350);
  expect(task.visible).toBe(false);
  analyzer.close();
});

test('索引时关闭编辑器会释放任务，不再轮询状态', async () => {
  vi.useFakeTimers();
  vi.mocked(nativeRequest)
    .mockResolvedValueOnce({ id: 'session' })
    .mockResolvedValueOnce({ ready: false, health: 'ok', tasks: [] })
    .mockResolvedValue({});
  const analyzer = new NativeAnalyzer();
  const opened = analyzer.open('fn main() {}', []);
  await vi.advanceTimersByTimeAsync(200);
  analyzer.close();
  await vi.advanceTimersByTimeAsync(1000);
  await opened;
  expect(resourceTasks.size).toBe(0);
  expect(
    vi.mocked(nativeRequest).mock.calls.filter(([path]) => path === 'lsp/status'),
  ).toHaveLength(1);
  expect(nativeRequest).toHaveBeenCalledWith(
    'lsp/close',
    { id: 'session' },
    'http://127.0.0.1:3000',
  );
});

test('语言服务初始化失败时显示原因并关闭会话', async () => {
  vi.useFakeTimers();
  vi.mocked(nativeRequest)
    .mockResolvedValueOnce({ id: 'session' })
    .mockResolvedValueOnce({ ready: true, health: 'error', message: 'workspace failed', tasks: [] })
    .mockResolvedValue({});
  const analyzer = new NativeAnalyzer();
  await expect(analyzer.open('fn main() {}', [])).rejects.toThrow('workspace failed');
  expect([...resourceTasks.values()][0]).toMatchObject({
    status: 'error',
    label: 'workspace failed',
  });
  expect(nativeRequest).toHaveBeenCalledWith(
    'lsp/close',
    { id: 'session' },
    'http://127.0.0.1:3000',
  );
  analyzer.close();
});
