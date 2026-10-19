import { expect, test, vi } from 'vite-plus/test';

import { ensureRustAnalyzer } from './native-runtime';

vi.mock('./logger', () => ({ logger: { info: vi.fn(), warn: vi.fn() }, logStep: vi.fn() }));

test('已有可用分析器时不调用 rustup 或重复安装', async () => {
  const run = vi.fn().mockResolvedValue('rust-analyzer existing');

  await expect(ensureRustAnalyzer(run)).resolves.toBe(true);
  expect(run.mock.calls).toEqual([
    ['rust-analyzer', ['--version']],
    ['rustc', ['--version']],
    ['cargo', ['--version']],
  ]);
});

test('分析器缺失时安装到活动工具链，并确认安装结果可用', async () => {
  const run = vi
    .fn()
    .mockRejectedValueOnce(new Error('Unknown binary'))
    .mockResolvedValueOnce('rustup installed')
    .mockResolvedValueOnce('nightly (directory override)')
    .mockResolvedValueOnce('')
    .mockResolvedValueOnce('rustc version')
    .mockResolvedValueOnce('cargo version')
    .mockResolvedValueOnce('rust-analyzer installed');

  await expect(ensureRustAnalyzer(run)).resolves.toBe(true);
  expect(run.mock.calls).toEqual([
    ['rust-analyzer', ['--version']],
    ['rustup', ['--version']],
    ['rustup', ['show', 'active-toolchain']],
    ['rustup', ['component', 'add', 'rust-analyzer'], true],
    ['rustc', ['--version']],
    ['cargo', ['--version']],
    ['rust-analyzer', ['--version']],
  ]);
});

test.each(['rustup', 'toolchain'])('缺少 %s 时保留浏览器模式，不尝试安装组件', async missing => {
  const run = vi.fn().mockRejectedValueOnce(new Error('Missing analyzer'));

  if (missing === 'toolchain') {
    run.mockResolvedValueOnce('rustup installed');
  }

  run.mockRejectedValue(new Error(`Missing ${missing}`));

  await expect(ensureRustAnalyzer(run)).resolves.toBe(false);
  expect(run.mock.calls.some(call => call[1]?.[0] === 'component')).toBe(false);
});

test.each(['installation', 'verification'])(
  '%s 失败时不能报告原生运行环境已就绪',
  async failure => {
    const error = new Error(`Failed ${failure}`);

    const run = vi
      .fn()
      .mockRejectedValueOnce(new Error('Missing analyzer'))
      .mockResolvedValueOnce('rustup installed')
      .mockResolvedValueOnce('stable');

    if (failure === 'verification') {
      run
        .mockResolvedValueOnce('')
        .mockResolvedValueOnce('rustc version')
        .mockResolvedValueOnce('cargo version');
    }

    run.mockRejectedValue(error);

    await expect(ensureRustAnalyzer(run)).rejects.toBe(error);
  },
);
