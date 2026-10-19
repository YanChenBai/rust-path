import { fileURLToPath } from 'node:url';

import { beforeAll, expect, test, vi } from 'vite-plus/test';

import { verifyAnswers } from './answers';
import { collectJobs, executeJobs } from './execution';
import { loadData } from './load';
import { verifyStructure } from './structure';
import type {
  CourseData,
  ExecutionJob,
  ExecutionResult,
  Report,
  VerificationContext,
} from './types';

vi.mock('../logger', () => ({ logStep: vi.fn() }));

function createContext(): VerificationContext {
  const report: Report = {
    startedAt: new Date().toISOString(),
    root: fileURLToPath(new URL('../../', import.meta.url)),
    node: process.version,
    stages: [],
    skipAdvancedLessons: false,
    structureOnly: false,
    concurrency: 2,
    sources: {},
    totals: {},
    checks: { passed: 0, failed: 0 },
    executions: [],
    failures: [],
  };

  return {
    report,
    check(condition, id, message, stage) {
      report.checks[condition ? 'passed' : 'failed'] += 1;

      if (!condition) {
        report.failures.push({ stage, id, message });
      }

      return Boolean(condition);
    },
    saveReport: vi.fn(async () => {}),
  };
}

let course: CourseData;

beforeAll(async () => {
  const context = createContext();
  course = await loadData(context.report.root, context.report);
});

test('结构检查不执行答案判定函数，答案检查能发现错误判定', () => {
  const question = course.chapters
    .flatMap(chapter => chapter.questions)
    .find(item => item.kind === 'choice')!;

  const accept = vi.fn(() => true);

  const data: CourseData = {
    ...course,
    assessments: {
      ...course.assessments,
      [question.id]: { ...course.assessments[question.id]!, accept },
    },
  };

  const structure = createContext();
  verifyStructure(data, structure);
  expect(structure.report.failures).toEqual([]);
  expect(accept).not.toHaveBeenCalled();

  const answers = createContext();
  verifyAnswers(data, answers);
  expect(accept).toHaveBeenCalled();
  expect(answers.report.failures.length).toBeGreaterThan(0);
  expect(
    answers.report.failures.every(item => item.stage === 'answers' && item.id === question.id),
  ).toBe(true);
  expect(answers.report.executions).toEqual([]);
});

test('跳过深入课时只移除对应示例，保留指南和编程参考实现', () => {
  const full = collectJobs(course, false);
  const skipped = collectJobs(course, true);
  const advanced = new Set(course.advancedLessonIds);

  expect(skipped).toEqual(full.filter(job => job.kind !== 'lesson' || !advanced.has(job.id)));
  expect(full.length - skipped.length).toBeGreaterThan(0);
  expect(full.filter(job => job.kind === 'guide')).toHaveLength(
    Object.values(course.lessonGuides)
      .flat()
      .filter(guide => guide.code !== undefined).length,
  );
});

test('单独执行 Rust 验收时，缺少断言不能被静默跳过', () => {
  const question = course.chapters
    .flatMap(chapter => chapter.questions)
    .find(item => item.kind === 'code')!;

  const data: CourseData = {
    ...course,
    assessments: {
      ...course.assessments,
      [question.id]: { ...course.assessments[question.id]!, tests: undefined },
    },
  };

  expect(() => collectJobs(data, false)).toThrow(`${question.id} 缺少可执行的参考答案或断言`);
});

function executionJobs(count: number): ExecutionJob[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `job-${index}`,
    kind: 'assessment',
    code: String(index),
    dependencies: [],
    requiresMarker: true,
  }));
}

const passed: ExecutionResult = { success: true, stdout: '__PASS__\n', stderr: '' };

test('限制在途任务为两个，释放槽位后继续执行，报告写入不重叠', async () => {
  const context = createContext();
  const gates = Array.from({ length: 4 }, () => Promise.withResolvers<ExecutionResult>());
  let active = 0;
  let peak = 0;
  let writes = 0;
  let peakWrites = 0;

  context.saveReport = vi.fn(async () => {
    writes += 1;
    peakWrites = Math.max(peakWrites, writes);
    await Promise.resolve();
    writes -= 1;
  });

  const runNative = vi.fn(({ code }: { code: string }) => {
    active += 1;
    peak = Math.max(peak, active);
    return gates[Number(code)]!.promise.finally(() => {
      active -= 1;
    });
  });

  const running = executeJobs(executionJobs(4), context, { concurrency: 2, runNative });
  expect(runNative).toHaveBeenCalledTimes(2);
  gates[1]!.resolve(passed);
  await vi.waitFor(() => expect(runNative).toHaveBeenCalledTimes(3));
  gates[0]!.resolve(passed);
  gates[2]!.resolve(passed);
  await vi.waitFor(() => expect(runNative).toHaveBeenCalledTimes(4));
  gates[3]!.resolve(passed);
  await running;

  expect(peak).toBe(2);
  expect(peakWrites).toBe(1);
  expect(context.saveReport).toHaveBeenCalledTimes(4);
  expect(new Set(context.report.executions.map(item => item.id))).toHaveLength(4);
  expect(context.report.failures).toEqual([]);
});

test('串行模式仍支持超时重试、完成标记检查，并继续记录其他任务', async () => {
  const context = createContext();
  let attempts = 0;

  const runNative = vi.fn(async ({ code }: { code: string }) => {
    if (code === '0' && attempts++ === 0) {
      return { success: false, stdout: '', stderr: 'timeout' };
    }

    if (code === '1') {
      return { success: true, stdout: 'prefix__PASS__', stderr: '' };
    }

    if (code === '2') {
      throw new Error('compiler failure');
    }

    return passed;
  });

  await executeJobs(executionJobs(4), context, { concurrency: 1, runNative });
  expect(context.report.executions.map(item => item.success)).toEqual([true, false, false, true]);
  expect(context.report.executions.map(item => item.attempts.length)).toEqual([2, 1, 1, 1]);
  expect(context.report.failures.map(item => item.id)).toEqual(['job-1', 'job-2']);
});

test('报告写入失败时停止取新任务，并等待在途任务完成后返回错误', async () => {
  const context = createContext();
  const error = new Error('report write failed');
  const gate = Promise.withResolvers<ExecutionResult>();

  const runNative = vi.fn(({ code }: { code: string }) =>
    code === '0' ? Promise.resolve(passed) : gate.promise,
  );

  context.saveReport = vi.fn().mockRejectedValue(error);

  const running = executeJobs(executionJobs(4), context, { concurrency: 2, runNative });
  const rejected = expect(running).rejects.toBe(error);
  await vi.waitFor(() => expect(context.saveReport).toHaveBeenCalledTimes(1));
  expect(runNative).toHaveBeenCalledTimes(2);
  gate.resolve(passed);
  await rejected;
  expect(context.report.executions).toHaveLength(2);
  expect(context.saveReport).toHaveBeenCalledTimes(2);
});

test.each([0, 3, 1.5, Number.NaN])('拒绝超出本机运行器能力的并发数 %s', async concurrency => {
  const runNative = vi.fn();
  await expect(
    executeJobs(executionJobs(1), createContext(), { concurrency, runNative }),
  ).rejects.toThrow('并发数必须为 1 或 2');
  expect(runNative).not.toHaveBeenCalled();
});
