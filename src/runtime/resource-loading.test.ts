import { afterEach, beforeEach, expect, test, vi } from 'vite-plus/test';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';

import ResourceLoading from '../components/layout/ResourceLoading.vue';
import { beginResourceLoading, resourceTasks } from './resource-loading';

const render = () => renderToString(createSSRApp(ResourceLoading));

beforeEach(() => vi.useFakeTimers());

afterEach(() => {
  resourceTasks.clear();
  vi.clearAllTimers();
  vi.useRealTimers();
});

test('未加载和全部就绪时隐藏，下载时显示可计量进度', async () => {
  expect(await render()).not.toContain('progressbar');
  const runtime = beginResourceLoading('runtime', '加载工具链', 32);
  runtime.progress(8, 32);
  await vi.advanceTimersByTimeAsync(200);
  expect(await render()).toContain('aria-valuenow="25"');
  runtime.stage('初始化运行引擎');
  const initializing = await render();
  expect(initializing).toContain('progressbar');
  expect(initializing).not.toContain('aria-valuenow');
  runtime.ready('运行引擎已就绪');
  await vi.advanceTimersByTimeAsync(350);
  expect(await render()).not.toContain('resource-loading');
});

test('一个编辑器完成或卸载不会隐藏其他编辑器的加载状态', async () => {
  const first = beginResourceLoading('editor', '编辑器一', 8);
  const second = beginResourceLoading('editor', '编辑器二', 8);
  first.ready('编辑器一已就绪');
  second.progress(4, 8);
  await vi.advanceTimersByTimeAsync(200);
  expect(await render()).toContain('aria-valuenow="50"');
  first.dispose();
  expect(await render()).toContain('aria-valuenow="50"');
  second.dispose();
  expect(await render()).not.toContain('resource-loading');
});

test('失败显示异常原因，重新加载成功后隐藏', async () => {
  const editor = beginResourceLoading('editor', '语义引擎');
  editor.fail('语义引擎加载超时');
  expect(await render()).toContain('语义引擎加载超时');
  editor.dispose();
  const retry = beginResourceLoading('editor', '重试语义引擎');
  retry.ready('语义引擎已就绪');
  expect(await render()).not.toContain('resource-loading');
});

test('200ms 内完成的加载不会闪现，已显示的加载平滑完成后隐藏', async () => {
  const fast = beginResourceLoading('runtime', '快速加载');
  await vi.advanceTimersByTimeAsync(100);
  fast.ready('已就绪');
  await vi.advanceTimersByTimeAsync(200);
  expect(await render()).not.toContain('resource-loading');

  const slow = beginResourceLoading('editor', '加载编辑工具');
  await vi.advanceTimersByTimeAsync(200);
  expect(await render()).toContain('progressbar');
  slow.ready('编辑工具已就绪');
  await vi.advanceTimersByTimeAsync(349);
  expect(await render()).toContain('编辑工具已就绪');
  await vi.advanceTimersByTimeAsync(1);
  expect(await render()).not.toContain('resource-loading');
});
