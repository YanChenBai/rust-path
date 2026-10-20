import { fileURLToPath } from 'node:url';

import { expect, test } from 'vite-plus/test';

import { coursePages } from '../plugins/course-pages';
import { loadCourseDocuments, loadCourseSources } from '../plugins/course-sources';
import { buildDocuments, parseDocument } from '../src/runtime/course-documents';

const root = fileURLToPath(new URL('../', import.meta.url));

test('每篇页面正文只归入对应课时、章节试卷或专项项目', async () => {
  const [files, sources] = await Promise.all([loadCourseDocuments(root), loadCourseSources(root)]);
  const documents = buildDocuments(files, sources);
  const pages = coursePages(documents);
  const paths = Object.values(pages).flat();

  const expected = Object.entries(files)
    .filter(([, source]) => parseDocument(source, sources).metadata.type !== 'chapter')
    .map(([path]) => path);

  expect([...paths].sort()).toEqual(expected.sort());
  expect(new Set(paths).size).toBe(paths.length);

  for (const chapter of documents.chapters) {
    expect(pages[`quiz-${chapter.id}`]).toEqual(
      chapter.questions.map(question => question.document),
    );
    expect(pages[`project-${chapter.id}`]).toEqual([chapter.project.document]);

    for (const lesson of chapter.lessons) {
      expect(pages[`lesson-${lesson.id}`]).toEqual([
        lesson.document,
        ...(documents.lessonGuides[lesson.id] ?? []).map(guide => guide.document),
      ]);
    }
  }
});
