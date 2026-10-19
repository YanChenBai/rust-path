import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { styleText } from 'node:util';

import { verifyAnswers } from './course-verification/answers';
import { collectJobs, executeJobs } from './course-verification/execution';
import { loadData } from './course-verification/load';
import { verifyStructure } from './course-verification/structure';
import type { Report, Stage, VerificationContext } from './course-verification/types';
import { logger, logReady, logStep } from './logger';

const started = performance.now();
const args = process.argv.slice(2);
const allStages: Stage[] = ['structure', 'answers', 'execution'];

if (args.includes('--help')) {
  logger.info(
    'oxnode scripts/verify-course.ts [--only structure|answers|execution] [--concurrency 1|2] [--skip-advanced-lessons] [--structure-only] [--previous-report PATH]',
  );
  logger.info('默认全量运行；--only 单独运行指定能力；--structure-only 等价于 --only structure。');
  logger.info(
    'execution 先批量编译，程序默认 2 路并发运行；--concurrency 1 使用串行。历史报告仅保留为 previousRun。',
  );
  process.exit(0);
}

let previousReportPath: string | undefined;
let only: Stage | undefined;
let concurrency = 2;

function invalidArguments(): never {
  logger.error('未知参数、冲突参数或缺少参数值；使用 --help 查看用法。');
  process.exit(2);
}

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  const value = args[index + 1];

  if (arg === '--previous-report') {
    if (!value || value.startsWith('--')) {
      invalidArguments();
    }

    previousReportPath = resolve(value);
    index += 1;
    continue;
  }

  if (arg === '--concurrency') {
    if (value !== '1' && value !== '2') {
      invalidArguments();
    }

    concurrency = Number(value);
    index += 1;
    continue;
  }

  if (arg === '--only') {
    if (!value || !allStages.includes(value as Stage) || only) {
      invalidArguments();
    }

    only = value as Stage;
    index += 1;
    continue;
  }

  if (arg !== '--skip-advanced-lessons' && arg !== '--structure-only') {
    invalidArguments();
  }
}

if (args.includes('--structure-only')) {
  if (only && only !== 'structure') {
    invalidArguments();
  }

  only = 'structure';
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const reports = join(root, '.rust-path/reports');
await mkdir(reports, { recursive: true });
const directory = await mkdtemp(join(reports, `${only ?? 'all'}-`));
const reportPath = join(directory, 'report.json');
const stages = only ? [only] : allStages;

const report: Report = {
  startedAt: new Date().toISOString(),
  node: process.version,
  root,
  stages,
  skipAdvancedLessons: args.includes('--skip-advanced-lessons'),
  structureOnly: only === 'structure',
  concurrency,
  sources: {},
  totals: {},
  checks: { passed: 0, failed: 0 },
  executions: [],
  failures: [],
};

const context: VerificationContext = {
  report,
  check(condition, id, message, stage) {
    report.checks[condition ? 'passed' : 'failed'] += 1;

    if (!condition) {
      report.failures.push({ stage, id, message });
      logStep(`[${stage}] ${id}: ${message}`, 'fail');
    }

    return Boolean(condition);
  },
  async saveReport() {
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  },
};

try {
  if (previousReportPath) {
    const previous = JSON.parse(await readFile(previousReportPath, 'utf8')) as Report;

    if (resolve(previous.root) !== root || !Array.isArray(previous.executions)) {
      throw new Error('历史报告不属于当前项目或缺少运行记录');
    }

    report.previousRun = {
      reportPath: previousReportPath,
      startedAt: previous.startedAt,
      finishedAt: previous.finishedAt,
      totals: previous.totals,
      executed: previous.executions.length,
      passed: previous.executions.filter(item => item.success).length,
      failed: previous.executions.filter(item => !item.success).length,
      note: '历史程序执行结果，不代表本次重新执行；本次验收范围见 stages。',
    };
  }

  const data = await loadData(root, report);

  for (const stage of stages) {
    const stageStarted = performance.now();
    const previousFailures = report.failures.length;

    switch (stage) {
      case 'structure': {
        verifyStructure(data, context);
        break;
      }

      case 'answers': {
        verifyAnswers(data, context);
        break;
      }

      case 'execution': {
        const jobs = collectJobs(data, report.skipAdvancedLessons);
        report.totals.scheduledExecutions = jobs.length;
        report.totals.skippedLessons = data.allLessons.filter(
          lesson => report.skipAdvancedLessons && data.advancedLessonIds.includes(lesson.id),
        ).length;
        await executeJobs(jobs, context, { concurrency });
        break;
      }
    }

    await context.saveReport();

    if (stages.length > 1) {
      logStep(
        stage,
        report.failures.length === previousFailures ? 'pass' : 'fail',
        performance.now() - stageStarted,
      );
    }
  }
} catch (error) {
  report.failures.push({
    stage: 'fatal',
    id: 'verification',
    message: error instanceof Error ? (error.stack ?? error.message) : String(error),
  });
  logger.error(error instanceof Error ? (error.stack ?? error.message) : String(error));
} finally {
  report.finishedAt = new Date().toISOString();
  report.totals.executed = report.executions.length;
  report.totals.passed = report.executions.filter(item => item.success).length;
  report.totals.failed = report.executions.filter(item => !item.success).length;
  report.success = report.failures.length === 0;
  await context.saveReport();
  logger.info(
    `检查 ${styleText('green', `${report.checks.passed} 通过`)} · ${styleText(report.checks.failed ? 'red' : 'dim', `${report.checks.failed} 失败`)}；Rust ${styleText('green', `${report.totals.passed} 通过`)} · ${styleText(report.totals.failed ? 'red' : 'dim', `${report.totals.failed} 失败`)}`,
  );

  if (report.failures.length) {
    logger.error(
      styleText(
        'red',
        `失败项：${report.failures.map(item => `${item.stage}:${item.id}`).join(', ')}`,
      ),
    );
  }

  logger.info(styleText('dim', `完整报告：${reportPath}`));
  logReady(`course · ${stages.join(' + ')}`, started, report.success);
  process.exitCode = report.success ? 0 : 1;
}
