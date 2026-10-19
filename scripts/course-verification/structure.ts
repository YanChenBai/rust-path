import type { Chapter, Lesson, Question } from '../../src/runtime/course-types';
import type { CourseData, VerificationContext } from './types';

export function verifyStructure(data: CourseData, context: VerificationContext) {
  const { chapters, allLessons, lessonGuides, assessments } = data;
  const { report } = context;

  const check = (condition: unknown, id: string, message: string) =>
    context.check(condition, id, message, 'structure');

  const namespaces = {
    chapter: new Map<string, string>(),
    editor: new Map<string, string>(),
    guide: new Map<string, string>(),
  };

  const expectedAssessments = new Set();
  const lessons = new Map<string, { chapter: Chapter; lesson: Lesson }>();

  let questionCount = 0;
  let codeCount = 0;
  let choiceCount = 0;
  let fillCount = 0;
  let guideCodeCount = 0;

  function unique(
    id: string,
    kind: 'chapter' | 'question' | 'project' | 'lesson' | 'guide-example',
  ) {
    // 章节选择与编辑器草稿分别存储；lesson/question/project 共用编辑器键。
    let namespace: keyof typeof namespaces = 'editor';

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

  function assessment(id: string, kind: Question['kind'] | 'project', options?: string[]) {
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

      check(!/#\s*\[\s*cfg\s*\(\s*test\s*\)/.test(entry.tests!), id, 'tests 不应包装 cfg(test)');
      check(!/\bfn\s+main\s*\(/.test(entry.answer), id, '参考答案不应自带 main');
      return;
    }

    check(typeof entry.accept === 'function', id, '文本答案缺少 accept 函数');

    if (kind === 'choice') {
      if (!check(Array.isArray(options) && options.length >= 2, id, 'choice 至少需要两个选项')) {
        return;
      }

      check(
        options!.filter(option => option === entry.answer).length === 1,
        id,
        '正确答案必须精确匹配唯一选项',
      );
    }
  }

  check(chapters.length > 0, 'chapters', '课程必须至少有一个章节');

  function verifyChapter(chapter: Chapter) {
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

      assessment(question.id, question.kind, question.options);
    }

    check(
      kindCounts.choice === 3 && kindCounts.fill === 3 && kindCounts.code === 2,
      chapter.id,
      `题型应为 3 choice / 3 fill / 2 code，实际 ${JSON.stringify(kindCounts)}`,
    );
    const projectId = `${chapter.id}-project`;
    unique(projectId, 'project');
    check(Boolean(chapter.project?.starter), projectId, '缺少项目 starter');
    assessment(projectId, 'project');

    for (const lesson of chapter.lessons) {
      unique(lesson.id, 'lesson');
      lessons.set(lesson.id, { chapter, lesson });
      check(
        typeof lesson.code === 'string' && lesson.code.trim().length > 0,
        lesson.id,
        '缺少 lesson 示例代码',
      );
      check(/\bfn\s+main\s*\(/.test(lesson.code), lesson.id, 'lesson 示例缺少完整 main');
    }
  }

  for (const chapter of chapters) {
    verifyChapter(chapter);
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
    }
  }

  for (const id of Object.keys(assessments)) {
    check(expectedAssessments.has(id), id, 'assessment 没有对应题目或项目');
  }

  check(lessons.size > 0, 'lessons', '课程必须至少有一个 lesson');
  check(
    allLessons.length === lessons.size &&
      allLessons.every(lesson => lessons.get(lesson.id)?.lesson === lesson),
    'allLessons',
    'allLessons 与章节 lesson 不一致',
  );
  check(
    expectedAssessments.size === Object.keys(assessments).length,
    'assessment-mapping',
    '题目/项目与 assessments 数量不一致',
  );

  Object.assign(report.totals, {
    chapters: chapters.length,
    questions: questionCount,
    choice: choiceCount,
    fill: fillCount,
    code: codeCount,
    projects: chapters.length,
    assessments: Object.keys(assessments).length,
    lessons: lessons.size,
    advancedLessons: data.advancedLessonIds.length,
    guideGroups: Object.keys(lessonGuides).length,
    guideExamples: guideCodeCount,
  });
}
