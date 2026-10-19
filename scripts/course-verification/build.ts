import { resolve } from 'node:path';

import { logStep } from '../logger';
import { runProcess } from './process';
import type { ExecutionJob, ExecutionResult, VerificationContext } from './types';

export interface BuildArtifact {
  executable?: string;
  fresh?: boolean;
  result?: ExecutionResult;
}

interface CargoMessage {
  reason: string;
  target?: { name: string; src_path: string };
  executable?: string | null;
  fresh?: boolean;
  message?: { level: string; rendered?: string; message: string };
}

// 只信任本次 Cargo 输出的产物，包括明确标记 fresh 的缓存；不按路径猜测旧 exe。
export function collectArtifacts(jobs: ExecutionJob[], cwd: string, result: ExecutionResult) {
  const byTarget = new Map(
    jobs.map(job => [job.source?.split('/').at(-1)?.replace(/\.rs$/, ''), job]),
  );

  const artifacts = new Map<string, BuildArtifact>();
  const diagnostics = new Map<string, string[]>();
  const globalErrors: string[] = [];

  for (const line of result.stdout.split(/\r?\n/)) {
    if (!line.startsWith('{')) {
      continue;
    }

    const message = JSON.parse(line) as CargoMessage;
    const target = message.target;
    const job = target && byTarget.get(target.name);

    if (
      message.reason === 'compiler-artifact' &&
      job?.source &&
      target &&
      message.executable &&
      resolve(target.src_path) === resolve(cwd, job.source)
    ) {
      artifacts.set(job.id, { executable: message.executable, fresh: message.fresh });
    }

    if (message.reason === 'compiler-message' && message.message?.level === 'error') {
      const error = message.message.rendered ?? message.message.message;

      if (job) {
        const errors = diagnostics.get(job.id) ?? [];
        errors.push(error);
        diagnostics.set(job.id, errors);
      } else {
        globalErrors.push(error);
      }
    }
  }

  for (const job of jobs) {
    const errors = diagnostics.get(job.id);

    if (errors || !artifacts.has(job.id)) {
      artifacts.set(job.id, {
        result: {
          success: false,
          stdout: '',
          stderr:
            errors?.join('\n') ||
            [...globalErrors, result.stderr].filter(Boolean).join('\n') ||
            '本次构建没有返回该示例的可执行产物',
        },
      });
    }
  }

  return artifacts;
}

export async function buildCourseJobs(jobs: ExecutionJob[], context: VerificationContext) {
  if (!jobs.length) {
    return new Map<string, BuildArtifact>();
  }

  const cwd = resolve(context.report.root, 'course');

  for (const job of jobs) {
    if (!job.source || !/^\d{2}-[^/]+\/src\/bin\/[^/]+\.rs$/.test(job.source)) {
      throw new Error(`${job.id} 缺少符合 course 固定目录结构的可编译源码`);
    }
  }

  const started = performance.now();

  const args = [
    'build',
    '--workspace',
    '--keep-going',
    '--message-format=json',
    ...[...new Set(jobs.map(job => job.source!.split('/').at(-1)!.replace(/\.rs$/, '')))].flatMap(
      bin => ['--bin', bin],
    ),
  ];

  const options = {
    cwd,
    timeout: 300_000,
    outputLimit: 16 * 1024 * 1024,
    env: { CARGO_TARGET_DIR: resolve(context.report.root, 'node_modules/.cache/course/target') },
  };

  let result = await runProcess('cargo', args, options);

  if (!result.success && /timeout/i.test(result.stderr)) {
    logStep('Cargo · 首次批量构建超时，利用缓存重试', 'retry');
    result = await runProcess('cargo', args, options);
  }

  const artifacts = collectArtifacts(jobs, cwd, result);
  const reusable = [...artifacts.values()].filter(item => item.executable && item.fresh).length;
  const compiled = [...artifacts.values()].filter(item => item.executable && !item.fresh).length;
  const failed = jobs.length - reusable - compiled;
  Object.assign(context.report.totals, {
    compiled,
    reused: reusable,
    buildFailed: failed,
    buildElapsed: Math.round(performance.now() - started),
  });
  logStep(
    `Cargo · 新编译 ${compiled} · 缓存复用 ${reusable} · 失败 ${failed}`,
    failed ? 'fail' : 'pass',
    performance.now() - started,
  );
  await context.saveReport();
  return artifacts;
}
