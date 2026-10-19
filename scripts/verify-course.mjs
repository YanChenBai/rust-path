import { createHash } from 'node:crypto';
import { mkdtemp, readFile, writeFile, readdir } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// 默认全量运行；复验时可明确跳过已独立验证的深入课程示例。
const args = process.argv.slice(2);

if (args.includes('--help')) {
  console.warn(
    'node scripts/verify-course.mjs [--skip-advanced-lessons] [--structure-only] [--previous-report PATH]',
  );
  console.warn('默认全量运行；--structure-only 不加载本机运行器、不编译或执行 Rust。');
  console.warn('--previous-report 将历史运行统计保留为 previousRun，不计入本次执行。');
  process.exit(0);
}

let previousReportPath;

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];

  if (arg === '--previous-report' && args[index + 1] && !args[index + 1].startsWith('--')) {
    previousReportPath = resolve(args[index + 1]);
    index += 1;
    continue;
  }

  if (arg !== '--skip-advanced-lessons' && arg !== '--structure-only') {
    console.error('未知参数或缺少报告路径；使用 --help 查看用法。');
    process.exit(2);
  }
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const directory = await mkdtemp(join(tmpdir(), 'rust-course-verification-'));
const reportPath = join(directory, 'report.json');

const skipAdvancedLessons = args.includes('--skip-advanced-lessons');
const structureOnly = args.includes('--structure-only');
const marker = '__PASS__';

const report = {
  startedAt: new Date().toISOString(),
  node: process.version,
  root,
  skipAdvancedLessons,
  structureOnly,
  sources: {},
  totals: {},
  checks: { passed: 0, failed: 0 },
  executions: [],
  failures: [],
};

function check(condition, id, message) {
  report.checks[condition ? 'passed' : 'failed'] += 1;

  if (!condition) {
    report.failures.push({ stage: 'structure', id, message });
    console.error(`FAIL [结构] ${id}: ${message}`);
  }

  return Boolean(condition);
}

async function saveReport() {
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

async function loadData() {
  const files = {};

  async function scan(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const path = join(folder, entry.name);

      if (entry.isDirectory()) {
        await scan(path);
        continue;
      }

      if (!entry.name.endsWith('.md')) {
        continue;
      }

      if (folder === join(root, 'src', 'docs')) {
        continue;
      }

      const source = await readFile(path, 'utf8');
      const key = path.slice(join(root, 'src', 'docs').length + 1).replaceAll('\\', '/');
      files[key] = source;
      report.sources[key] = createHash('sha256').update(source).digest('hex');
    }
  }

  await scan(join(root, 'src', 'docs'));
  const source = await readFile(join(root, 'src/runtime/course-documents.ts'), 'utf8');

  const javascript = stripTypeScriptTypes(source, { mode: 'strip' }).replace(
    "from 'yaml'",
    `from '${pathToFileURL(join(root, 'node_modules/yaml/dist/index.js')).href}'`,
  );

  await writeFile(join(directory, 'parse.mjs'), javascript);
  const { buildDocuments } = await import(pathToFileURL(join(directory, 'parse.mjs')).href);
  const documents = buildDocuments(files);

  const migration = JSON.parse(
    await readFile(join(root, 'src/data/course-migration.json'), 'utf8'),
  );

  const { assessments } = await import(pathToFileURL(join(root, 'src/data/assessments.js')).href);
  return {
    ...documents,
    legacyChapters: migration.legacyChapters,
    advancedChapters: [{ lessons: migration.advancedLessonIds.map(id => ({ id })) }],
    extraQuestions: {},
    assessments,
    advancedAssessments: {},
    extraAssessments: {},
  };
}

function verifyStructure(data) {
  const { chapters, allLessons, advancedChapters, extraQuestions, lessonGuides, assessments } =
    data;

  const namespaces = { chapter: new Map(), editor: new Map(), guide: new Map() };
  const expectedAssessments = new Set();
  const lessons = new Map();
  const jobs = [];

  const advancedIds = new Set(
    advancedChapters.flatMap(chapter => chapter.lessons.map(lesson => lesson.id)),
  );

  let questionCount = 0;
  let codeCount = 0;
  let choiceCount = 0;
  let fillCount = 0;
  let guideCodeCount = 0;
  let skippedLessons = 0;

  function unique(id, kind) {
    // 章节选择与编辑器草稿分别存储；lesson/question/project 共用编辑器键。
    let namespace = 'editor';

    if (kind === 'chapter') {
      namespace = 'chapter';
    } else if (kind === 'guide-example') {
      namespace = 'guide';
    }

    const seen = namespaces[namespace];
    check(typeof id === 'string' && id.length > 0, String(id), `${kind} 必须有非空 id`);
    check(
      !seen.has(id),
      String(id),
      `${namespace} 命名空间内 ${kind} id 重复，首次类型为 ${seen.get(id)}`,
    );
    seen.set(id, kind);
  }

  function assessment(id, kind, chapter, options) {
    expectedAssessments.add(id);
    const entry = assessments[id];

    if (!check(entry && typeof entry === 'object', id, '缺少 assessment 对象')) {
      return;
    }

    check(
      typeof entry.answer === 'string' && entry.answer.trim().length > 0,
      id,
      '参考答案必须是非空字符串',
    );
    check(
      typeof entry.explanation === 'string' && entry.explanation.trim().length > 0,
      id,
      '缺少答案解释',
    );

    if (kind === 'code' || kind === 'project') {
      if (
        !check(
          typeof entry.tests === 'string' && entry.tests.trim().length > 0,
          id,
          '缺少断言字符串',
        )
      ) {
        return;
      }

      check(!/#\s*\[\s*cfg\s*\(\s*test\s*\)/.test(entry.tests), id, 'tests 不应包装 cfg(test)');
      check(!/\bfn\s+main\s*\(/.test(entry.answer), id, '参考答案不应自带 main');
      jobs.push({
        id,
        kind: kind === 'project' ? 'project' : 'assessment',
        dependencies: chapter.dependencies ?? [],
        code: `${entry.answer}\nfn main(){${entry.tests}\n println!("${marker}");}`,
        requiresMarker: true,
      });
      return;
    }

    if (!check(typeof entry.accept === 'function', id, '文本答案缺少 accept 函数')) {
      return;
    }

    try {
      check(entry.accept(entry.answer) === true, id, 'accept 未接受参考答案');

      for (const invalid of ['', '__VERIFY_INVALID_ANSWER__']) {
        check(
          entry.accept(invalid) === false,
          id,
          `accept 未明确拒绝无效输入 ${JSON.stringify(invalid)}`,
        );
      }

      if (kind === 'choice') {
        if (!check(Array.isArray(options) && options.length >= 2, id, 'choice 至少需要两个选项')) {
          return;
        }

        check(
          options.filter(option => option === entry.answer).length === 1,
          id,
          '正确答案必须精确匹配唯一选项',
        );

        for (const option of options) {
          check(
            entry.accept(option) === (option === entry.answer),
            id,
            `accept 对选项 ${JSON.stringify(option)} 判定错误`,
          );
        }
      }
    } catch (error) {
      check(false, id, `accept 抛出异常：${error.message}`);
    }
  }

  check(chapters.length === 32, 'chapters', `应有 32 章，实际 ${chapters.length}`);

  for (const chapter of chapters) {
    unique(chapter.id, 'chapter');
    check(
      chapter.questions.length === 8,
      chapter.id,
      `应有 8 题，实际 ${chapter.questions.length}`,
    );
    const kindCounts = { choice: 0, fill: 0, code: 0 };

    for (const question of chapter.questions) {
      unique(question.id, 'question');
      questionCount += 1;
      check(Object.hasOwn(kindCounts, question.kind), question.id, `未知题目类型 ${question.kind}`);
      kindCounts[question.kind] += 1;

      if (question.kind === 'code') {
        codeCount += 1;
      }

      if (question.kind === 'choice') {
        choiceCount += 1;
      }

      if (question.kind === 'fill') {
        fillCount += 1;
      }

      assessment(question.id, question.kind, chapter, question.options);
    }

    check(
      kindCounts.choice === 3 && kindCounts.fill === 3 && kindCounts.code === 2,
      chapter.id,
      `题型应为 3 choice / 3 fill / 2 code，实际 ${JSON.stringify(kindCounts)}`,
    );
    const projectId = `${chapter.id}-project`;
    unique(projectId, 'project');
    check(Boolean(chapter.project?.starter), projectId, '缺少项目 starter');
    assessment(projectId, 'project', chapter);

    for (const lesson of chapter.lessons) {
      unique(lesson.id, 'lesson');
      lessons.set(lesson.id, { chapter, lesson });
      check(
        typeof lesson.code === 'string' && lesson.code.trim().length > 0,
        lesson.id,
        '缺少 lesson 示例代码',
      );
      check(/\bfn\s+main\s*\(/.test(lesson.code), lesson.id, 'lesson 示例缺少完整 main');

      if (skipAdvancedLessons && advancedIds.has(lesson.id)) {
        skippedLessons += 1;
        continue;
      }

      jobs.push({
        id: lesson.id,
        kind: 'lesson',
        code: lesson.code,
        dependencies: lesson.dependencies ?? chapter.dependencies ?? [],
      });
    }
  }

  for (const [chapterId, questions] of Object.entries(extraQuestions)) {
    const chapter = data.legacyChapters.find(item => item.id === chapterId);

    if (!check(Boolean(chapter), chapterId, 'extraQuestions 指向不存在的章节')) {
      continue;
    }

    for (const question of questions) {
      check(
        chapter.questions.filter(item => item.id === question.id).length === 1,
        question.id,
        '增量题未正确合并到课程',
      );
    }
  }

  for (const [lessonId, guides] of Object.entries(lessonGuides)) {
    const owner = lessons.get(lessonId);

    if (!check(Boolean(owner), lessonId, 'guide 指向不存在的 lesson')) {
      continue;
    }

    for (const [index, guide] of guides.entries()) {
      if (guide.code === undefined) {
        continue;
      }

      const id = `${lessonId}-guide-${index + 1}`;
      unique(id, 'guide-example');
      guideCodeCount += 1;
      check(
        typeof guide.code === 'string' && /\bfn\s+main\s*\(/.test(guide.code),
        id,
        'guide 示例缺少完整 main',
      );
      jobs.push({
        id,
        kind: 'guide',
        code: guide.code,
        dependencies: owner.lesson.dependencies ?? owner.chapter.dependencies ?? [],
      });
    }
  }

  for (const id of Object.keys(assessments)) {
    check(expectedAssessments.has(id), id, 'assessment 没有对应题目或项目');
  }

  const advancedKeys = new Set(Object.keys(data.advancedAssessments));

  for (const id of Object.keys(data.extraAssessments)) {
    check(!advancedKeys.has(id), id, '增量与深入答案导出发生覆盖');
  }

  for (const [id, entry] of [
    ...Object.entries(data.advancedAssessments),
    ...Object.entries(data.extraAssessments),
  ]) {
    check(
      assessments[id] === undefined || assessments[id] === entry || id.endsWith('-project'),
      id,
      '合并答案覆盖了原始导出',
    );
  }

  check(lessons.size >= 65, 'lessons', `重组后应至少有 65 个 lesson，实际 ${lessons.size}`);
  check(
    allLessons.length === lessons.size &&
      allLessons.every(lesson => lessons.get(lesson.id)?.lesson === lesson),
    'allLessons',
    'allLessons 与章节 lesson 不一致',
  );
  check(
    Object.keys(lessonGuides).length === 17,
    'guides',
    `应有 17 组 guide，实际 ${Object.keys(lessonGuides).length}`,
  );
  check(guideCodeCount === 17, 'guide-examples', `应有 17 个 guide 示例，实际 ${guideCodeCount}`);
  check(
    codeCount + chapters.length === 96,
    'executable-assessments',
    `应有 96 份 code/project，实际 ${codeCount + chapters.length}`,
  );
  check(
    expectedAssessments.size === Object.keys(assessments).length,
    'assessment-mapping',
    '题目/项目与 assessments 数量不一致',
  );

  report.totals = {
    chapters: chapters.length,
    questions: questionCount,
    choice: choiceCount,
    fill: fillCount,
    code: codeCount,
    projects: chapters.length,
    assessments: Object.keys(assessments).length,
    lessons: lessons.size,
    advancedLessons: advancedIds.size,
    guideGroups: Object.keys(lessonGuides).length,
    guideExamples: guideCodeCount,
    skippedLessons,
    scheduledExecutions: jobs.length,
  };
  return jobs;
}

async function executeJobs(jobs) {
  // 仅复用导出的本机 API，不启动 HTTP 服务；串行避免共享编译缓存竞争。
  const { runNative } = await import(pathToFileURL(join(root, 'server/rust.mjs')).href);

  for (const [index, job] of jobs.entries()) {
    console.warn(`[${index + 1}/${jobs.length}] ${job.kind} ${job.id}`);
    const started = Date.now();
    const execution = { id: job.id, kind: job.kind, dependencies: job.dependencies, attempts: [] };
    let result;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        result = await runNative({ code: job.code, dependencies: job.dependencies });
      } catch (error) {
        result = { success: false, stdout: '', stderr: error.stack ?? String(error) };
      }

      execution.attempts.push(result);
      const cacheTimeout = /120 秒|timed?\s*out|timeout|超过.*秒/i.test(result.stderr ?? '');

      if (result.success || !cacheTimeout || attempt === 1) {
        break;
      }

      console.warn(`RETRY ${job.id}: 首次构建超时，利用编译缓存重试一次`);
    }

    execution.elapsed = Date.now() - started;
    execution.success =
      result.success === true &&
      (!job.requiresMarker || result.stdout?.split(/\r?\n/).includes(marker));
    report.executions.push(execution);

    if (!execution.success) {
      const message = result.success
        ? '进程退出成功但没有断言完成标记'
        : result.stderr || '本机执行失败，未返回诊断';

      report.failures.push({ stage: 'execution', id: job.id, kind: job.kind, message });
      console.error(`FAIL ${job.id}: ${message}`);
    } else {
      console.warn(`PASS ${job.id} (${execution.elapsed}ms)`);
    }

    // 每项完成都保存，便于长时间编译或意外中断后查看已完成的覆盖。
    await saveReport();
  }
}

console.warn(`临时报告：${reportPath}`);

try {
  if (previousReportPath) {
    const previous = JSON.parse(await readFile(previousReportPath, 'utf8'));

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
      note: '历史程序执行结果，不代表本次重新执行；历史结构结论由本次检查替代。',
    };
  }

  const data = await loadData();
  const jobs = verifyStructure(data);
  await saveReport();
  console.warn(`内容总数：${JSON.stringify(report.totals)}`);

  if (!structureOnly) {
    await executeJobs(jobs);
  }
} catch (error) {
  report.failures.push({
    stage: 'fatal',
    id: 'verification',
    message: error.stack ?? String(error),
  });
  console.error(error);
} finally {
  report.finishedAt = new Date().toISOString();
  report.totals.executed = report.executions.length;
  report.totals.passed = report.executions.filter(item => item.success).length;
  report.totals.failed = report.executions.filter(item => !item.success).length;
  report.success = report.failures.length === 0;
  await saveReport();
  console.warn(`验收${report.success ? '通过' : '失败'}：${JSON.stringify(report.totals)}`);
  console.warn(
    `失败项：${report.failures.map(item => `${item.stage}:${item.id}`).join(', ') || '无'}`,
  );
  console.warn(`完整报告：${reportPath}`);
  process.exitCode = report.success ? 0 : 1;
}
