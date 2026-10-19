import { describe, expect, it } from 'vite-plus/test';

import { assessments } from './assessments.js';
import { allLessons, chapters } from './course';
import { curriculumOrder } from './curriculum';

const chapterIds = curriculumOrder;

const questions = chapters.flatMap(chapter => chapter.questions);
const projectIds = chapters.map(chapter => `${chapter.id}-project`);

describe('课程数据集成', () => {
  it('按学习路径集成完整的 32 章和 256 道题', () => {
    expect(chapters.map(chapter => chapter.id)).toEqual(chapterIds);
    expect(questions).toHaveLength(256);
    expect(projectIds).toHaveLength(32);
    expect(allLessons).toEqual(chapters.flatMap(chapter => chapter.lessons));

    for (const chapter of chapters) {
      for (const lesson of chapter.lessons) {
        expect(allLessons.find(item => item.id === lesson.id)).toBe(lesson);
      }
    }
  });

  it('章节 ID 唯一，课时、题目和项目的存储 ID 不冲突', () => {
    expect(new Set(chapters.map(chapter => chapter.id)).size).toBe(chapters.length);

    const ids = [
      ...allLessons.map(lesson => lesson.id),
      ...questions.map(question => question.id),
      ...projectIds,
    ];

    expect(ids.every(id => id.trim().length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('256 道题和 32 个项目与答案一一对应，没有漏项或游离答案', () => {
    const expected = [...questions.map(question => question.id), ...projectIds].sort();
    expect(Object.keys(assessments).sort()).toEqual(expected);
    expect(Object.keys(assessments)).toHaveLength(288);
  });

  it('旧知识点只迁移一次，拆章后的主题按前置知识排列', () => {
    const owner = (id: string) =>
      chapters.find(chapter => chapter.lessons.some(lesson => lesson.id === id))?.id;

    expect(owner('borrow')).toBe('borrowing');
    expect(owner('traits-generics')).toBe('generics');
    expect(owner('traits-lifetimes')).toBe('lifetimes');
    expect(owner('traits-dyn')).toBe('dyn');
    expect(owner('tests')).toBe('tests');
    expect(owner('threads-locks')).toBe('shared');
    expect(owner('async-cancel')).toBe('shutdown');
    expect(chapterIds.indexOf('strings')).toBeLessThan(chapterIds.indexOf('collections'));
    expect(chapterIds.indexOf('iterators')).toBeLessThan(chapterIds.indexOf('combinators'));
    expect(chapterIds.indexOf('generics')).toBeLessThan(chapterIds.indexOf('dyn'));
  });

  describe.each(chapters)('$id 章', chapter => {
    it('包含 3 道选择、3 道填空、2 道编程题及一个完整项目', () => {
      expect(chapter.questions).toHaveLength(8);
      expect(chapter.questions.filter(question => question.kind === 'choice')).toHaveLength(3);
      expect(chapter.questions.filter(question => question.kind === 'fill')).toHaveLength(3);
      expect(chapter.questions.filter(question => question.kind === 'code')).toHaveLength(2);
      expect(chapter.lessons.length).toBeGreaterThan(0);
      expect(chapter.project.title.trim()).not.toBe('');
      expect(chapter.project.description.trim()).not.toBe('');
      expect(chapter.project.requirements.length).toBeGreaterThan(0);
      expect(chapter.project.starter).toMatch(/\bfn\s+main\s*\(/);
    });
  });

  describe.each(questions)('$id', question => {
    it('提供清晰题面、答案与解析，文本题不误接受错误输入', () => {
      expect(question.title.trim()).not.toBe('');
      expect(question.prompt.trim()).not.toBe('');
      const assessment = assessments[question.id];
      expect(assessment).toBeDefined();

      if (!assessment) {
        throw new Error(`缺少答案：${question.id}`);
      }

      expect(assessment.answer.trim()).not.toBe('');
      expect(assessment.explanation.trim()).not.toBe('');

      if (question.kind === 'code') {
        expect(question.starter).toMatch(/\bfn\s+main\s*\(/);
        expect(assessment.tests?.trim()).not.toBe('');
        expect(assessment.tests).toMatch(/\bassert(?:_eq|_ne)?!/);
        expect(assessment.tests).not.toMatch(/#\s*\[\s*test\s*\]/);
        expect(assessment.answer).not.toMatch(/\bfn\s+main\s*\(/);
        return;
      }

      const accept = assessment.accept;
      expect(accept).toBeTypeOf('function');

      if (!accept) {
        throw new Error(`缺少文本判题函数：${question.id}`);
      }

      expect(accept(assessment.answer.trim())).toBe(true);
      expect(accept(` \n${assessment.answer.trim()}\t `)).toBe(true);

      for (const wrong of ['', ' \t\n', '__错误答案__', `${assessment.answer}__错误后缀__`]) {
        expect(accept(wrong), `不应接受 ${JSON.stringify(wrong)}`).toBe(false);
      }

      if (question.kind === 'choice') {
        expect(question.options).toHaveLength(4);
        const options = question.options ?? [];
        expect(new Set(options).size).toBe(4);
        expect(options).toContain(assessment.answer);
        expect(options.filter(option => accept(option))).toEqual([assessment.answer]);

        for (const option of options) {
          expect(accept(` ${option}\n`)).toBe(option === assessment.answer);
        }
      }
    });
  });

  it.each(projectIds)('%s 提供参考源码、边界断言与解析', id => {
    const assessment = assessments[id];
    expect(assessment).toBeDefined();
    expect(assessment?.answer.trim()).not.toBe('');
    expect(assessment?.explanation.trim()).not.toBe('');
    expect(assessment?.tests?.trim()).not.toBe('');
    expect(assessment?.tests).toMatch(/\bassert(?:_eq|_ne)?!/);
    expect(assessment?.tests).not.toMatch(/#\s*\[\s*test\s*\]/);
  });
});
