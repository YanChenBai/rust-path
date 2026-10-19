import type { Chapter, Lesson } from '../../src/runtime/course-types';
import { logStep } from '../logger';
import { buildCourseJobs } from './build';
import { runExecutable } from './process';
import type {
  CourseData,
  ExecutionJob,
  Execution,
  ExecutionResult,
  VerificationContext,
} from './types';

const marker = '__PASS__';

function collectLessonJobs(
  data: CourseData,
  chapter: Chapter,
  lesson: Lesson,
  skipLesson: boolean,
): ExecutionJob[] {
  const jobs: ExecutionJob[] = [];
  const dependencies = lesson.dependencies ?? chapter.dependencies ?? [];

  if (!skipLesson) {
    jobs.push({
      id: lesson.id,
      kind: 'lesson',
      code: lesson.code,
      source: lesson.codeSource,
      dependencies,
    });
  }

  for (const [index, guide] of (data.lessonGuides[lesson.id] ?? []).entries()) {
    if (guide.code !== undefined) {
      jobs.push({
        id: `${lesson.id}-guide-${index + 1}`,
        kind: 'guide',
        code: guide.code,
        source: guide.codeSource,
        dependencies,
      });
    }
  }

  return jobs;
}

export function collectJobs(data: CourseData, skipAdvancedLessons: boolean): ExecutionJob[] {
  const jobs: ExecutionJob[] = [];
  const advancedIds = new Set(data.advancedLessonIds);

  for (const chapter of data.chapters) {
    for (const item of [
      ...chapter.questions.filter(question => question.kind === 'code'),
      { id: `${chapter.id}-project`, kind: 'project' },
    ]) {
      const entry = data.assessments[item.id];

      if (!entry?.answer || !entry.tests) {
        throw new Error(`${item.id} 缺少可执行的参考答案或断言`);
      }

      jobs.push({
        id: item.id,
        kind: item.kind === 'project' ? 'project' : 'assessment',
        dependencies: chapter.dependencies ?? [],
        code: `${entry.answer}\nfn main(){${entry.tests}\n println!("${marker}");}`,
        requiresMarker: true,
        source: entry.source,
      });
    }

    for (const lesson of chapter.lessons) {
      jobs.push(
        ...collectLessonJobs(
          data,
          chapter,
          lesson,
          skipAdvancedLessons && advancedIds.has(lesson.id),
        ),
      );
    }
  }

  return jobs;
}

type NativeRunner = (job: ExecutionJob) => Promise<ExecutionResult>;

async function runWithRetry(job: ExecutionJob, execution: Execution, runNative: NativeRunner) {
  let result: ExecutionResult = { success: false, stdout: '', stderr: '未执行' };

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      result = await runNative(job);
    } catch (error) {
      result = {
        success: false,
        stdout: '',
        stderr: error instanceof Error ? (error.stack ?? error.message) : String(error),
      };
    }

    execution.attempts.push(result);
    const cacheTimeout = /120 秒|timed?\s*out|timeout|超过.*秒/i.test(result.stderr ?? '');

    if (result.success || !cacheTimeout || attempt === 1) {
      break;
    }

    logStep(`${job.id} · 首次执行超时，重试一次`, 'retry');
  }

  return result;
}

interface ExecutionOptions {
  concurrency?: number;
  runNative?: NativeRunner;
}

export async function executeJobs(
  jobs: ExecutionJob[],
  context: VerificationContext,
  options: ExecutionOptions = {},
) {
  const concurrency = options.concurrency ?? 2;

  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 2) {
    throw new Error('并发数必须为 1 或 2');
  }

  const artifacts = options.runNative ? undefined : await buildCourseJobs(jobs, context);

  const runNative: NativeRunner =
    options.runNative ??
    (async job => {
      const artifact = artifacts!.get(job.id)!;
      return artifact.executable ? runExecutable(artifact.executable) : artifact.result!;
    });

  const { report } = context;
  let next = 0;
  let completed = 0;
  let stopped = false;
  let pendingSave = Promise.resolve();

  // 编译并行，报告写入排队；写入失败后仍等待在途任务结束，再交给上层收尾。
  function saveReport() {
    const save = pendingSave.then(() => context.saveReport());
    pendingSave = save.catch(() => {});
    return save;
  }

  async function executeJob(job: ExecutionJob) {
    const started = performance.now();

    const execution: Execution = {
      id: job.id,
      kind: job.kind,
      dependencies: job.dependencies,
      attempts: [],
      elapsed: 0,
      success: false,
    };

    const result = await runWithRetry(job, execution, runNative);
    execution.elapsed = performance.now() - started;
    execution.success =
      result.success === true &&
      (!job.requiresMarker || result.stdout.split(/\r?\n/).includes(marker));
    report.executions.push(execution);
    completed += 1;
    const label = `[${completed}/${jobs.length}] ${job.id}`;

    if (!execution.success) {
      const message = result.success
        ? '进程退出成功但没有断言完成标记'
        : result.stderr || '本机执行失败，未返回诊断';

      report.failures.push({ stage: 'execution', id: job.id, kind: job.kind, message });
      logStep(`${label}\n${message}`, 'fail', execution.elapsed);
    } else {
      logStep(label, 'pass', execution.elapsed);
    }

    await saveReport();
  }

  async function worker() {
    while (!stopped && next < jobs.length) {
      const index = next++;

      try {
        await executeJob(jobs[index]!);
      } catch (error) {
        stopped = true;
        throw error;
      }
    }
  }

  const results = await Promise.allSettled(
    Array.from({ length: Math.min(concurrency, jobs.length) }, () => worker()),
  );

  const failed = results.find(result => result.status === 'rejected');

  if (failed?.status === 'rejected') {
    throw failed.reason;
  }
}
