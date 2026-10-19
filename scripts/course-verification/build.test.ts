import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { expect, test, vi } from 'vite-plus/test';

import { buildCourseJobs, collectArtifacts } from './build';
import { runExecutable, runProcess } from './process';
import type { ExecutionJob, Report, VerificationContext } from './types';

vi.mock('../logger', () => ({ logStep: vi.fn() }));

test('批量构建保留成功产物，复用缓存，修改源码后不会误用旧二进制', async () => {
  const root = await mkdtemp(join(tmpdir(), 'rust-course-build-test-'));
  const folder = join(root, 'course/01-demo/src/bin');

  const jobs: ExecutionJob[] = ['good', 'bad'].map(id => ({
    id,
    kind: 'lesson',
    code: '',
    dependencies: [],
    source: `01-demo/src/bin/${id}.rs`,
  }));

  const context: VerificationContext = {
    report: { root, totals: {} } as Report,
    check: () => true,
    saveReport: async () => {},
  };

  try {
    await mkdir(folder, { recursive: true });
    await writeFile(
      join(root, 'course/Cargo.toml'),
      '[workspace]\nresolver = "3"\nmembers = ["01-demo"]\n',
    );
    await writeFile(
      join(root, 'course/01-demo/Cargo.toml'),
      '[package]\nname = "course-demo"\nversion = "0.1.0"\nedition = "2024"\n',
    );
    await writeFile(join(folder, 'good.rs'), 'fn main() { println!("original"); }');
    await writeFile(join(folder, 'bad.rs'), 'fn main() { not_defined(); }');

    const first = await buildCourseJobs(jobs, context);
    expect(first.get('bad')?.result?.stderr).toContain('not_defined');
    expect((await runExecutable(first.get('good')!.executable!)).stdout.trim()).toBe('original');

    const cached = await buildCourseJobs([jobs[0]!], context);
    expect(cached.get('good')?.fresh).toBe(true);

    await writeFile(join(folder, 'good.rs'), 'fn main() { println!("changed"); }');
    await writeFile(join(folder, 'bad.rs'), 'fn main() {}');
    const fixed = await buildCourseJobs(jobs, context);
    expect(fixed.get('good')?.fresh).toBe(false);
    expect((await runExecutable(fixed.get('good')!.executable!)).stdout.trim()).toBe('changed');
    expect(fixed.get('bad')?.executable).toBeTruthy();

    await writeFile(join(folder, 'bad.rs'), 'fn main() { still_invalid(); }');
    const brokenAgain = await buildCourseJobs(jobs, context);
    expect(brokenAgain.get('bad')?.executable).toBeUndefined();
    expect(brokenAgain.get('bad')?.result?.stderr).toContain('still_invalid');
  } finally {
    await rm(root, { recursive: true, force: true, maxRetries: 4, retryDelay: 100 });
  }
}, 30_000);

test('Cargo 未输出当前示例的产物时，不能将构建成功视为该项通过', () => {
  const jobs: ExecutionJob[] = [
    {
      id: 'missing',
      kind: 'lesson',
      code: '',
      dependencies: [],
      source: '01-demo/src/bin/missing.rs',
    },
  ];

  const artifacts = collectArtifacts(jobs, process.cwd(), {
    success: true,
    stdout: '',
    stderr: '',
  });

  expect(artifacts.get('missing')?.result?.success).toBe(false);
});

test('程序输出过大或超时会终止执行并返回诊断', async () => {
  const cwd = process.cwd();

  const oversized = await runProcess(
    process.execPath,
    ['-e', 'process.stdout.write("x".repeat(10000));setInterval(()=>{},1000)'],
    { cwd, timeout: 10_000, outputLimit: 128 },
  );

  expect(oversized.success).toBe(false);
  expect(oversized.stdout.length).toBeLessThanOrEqual(128);
  expect(oversized.stderr).toContain('输出超过');

  const timeout = await runProcess(process.execPath, ['-e', 'setInterval(()=>{},1000)'], {
    cwd,
    timeout: 100,
    outputLimit: 128,
  });

  expect(timeout.success).toBe(false);
  expect(timeout.stderr).toContain('timeout');
});
