import { beforeEach, expect, test, vi } from 'vite-plus/test';

beforeEach(() => {
  vi.resetModules();
  vi.stubGlobal('fetch', vi.fn());
});

const documents = { 'hello.md': { render: () => null } };

class ModuleScript extends EventTarget {
  type = 'module';
  dataset: Record<string, string> = {};
  textContent = '';
  remove = vi.fn();
}

test('首屏直接等待 HTML 内联模块注册，不发出额外请求', async () => {
  const script = new ModuleScript();
  vi.stubGlobal('document', { querySelector: () => script });
  const runtime = await import('./course-page-loader');
  const pending = runtime.loadCoursePage('lesson-hello', '/learn/hello');
  runtime.registerCoursePage('lesson-hello', documents);
  script.dispatchEvent(new Event('load'));
  await expect(pending).resolves.toBe(documents);
  expect(fetch).not.toHaveBeenCalled();
});

test('切页读取目标 HTML 并复用并发请求和已注册组件', async () => {
  const runtime = await import('./course-page-loader');

  const append = vi.fn((script: ModuleScript) => {
    runtime.registerCoursePage('lesson-hello', documents);
    script.dispatchEvent(new Event('load'));
  });

  vi.stubGlobal('document', {
    querySelector: () => null,
    createElement: () => new ModuleScript(),
    head: { append },
  });
  vi.stubGlobal(
    'DOMParser',
    class {
      parseFromString() {
        return { querySelector: () => ({ textContent: '内联组件模块' }) };
      }
    },
  );
  vi.mocked(fetch).mockResolvedValue(new Response('<html>目标页面</html>'));
  const first = runtime.loadCoursePage('lesson-hello', '/learn/hello');
  const second = runtime.loadCoursePage('lesson-hello', '/learn/hello');

  expect(second).toBe(first);
  await expect(first).resolves.toBe(documents);
  await expect(runtime.loadCoursePage('lesson-hello', '/learn/hello')).resolves.toBe(documents);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(
    '/learn/hello',
    expect.objectContaining({ headers: { Accept: 'text/html' } }),
  );
  expect(append).toHaveBeenCalledTimes(1);
  expect(append.mock.calls[0]![0].textContent).toBe('内联组件模块');
});

test('HTML 请求失败会拒绝加载并允许重试', async () => {
  vi.stubGlobal('document', { querySelector: () => null });
  vi.mocked(fetch).mockResolvedValue(new Response('404', { status: 404 }));
  const runtime = await import('./course-page-loader');

  await expect(runtime.loadCoursePage('lesson-hello', '/learn/hello')).rejects.toThrow('404');
  await expect(runtime.loadCoursePage('lesson-hello', '/learn/hello')).rejects.toThrow('404');
  expect(fetch).toHaveBeenCalledTimes(2);
});

test('目标 HTML 没有对应模块时报告错误，避免静默渲染空页面', async () => {
  vi.stubGlobal('document', { querySelector: () => null });
  vi.stubGlobal(
    'DOMParser',
    class {
      parseFromString() {
        return { querySelector: () => null };
      }
    },
  );
  vi.mocked(fetch).mockResolvedValue(new Response('<html>旧页面</html>'));
  const runtime = await import('./course-page-loader');

  await expect(runtime.loadCoursePage('lesson-hello', '/learn/hello')).rejects.toThrow(
    '缺少内联模块',
  );
});
