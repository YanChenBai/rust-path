import type { buildDocuments } from '../src/runtime/course-documents';

export function coursePageRoute(page: string) {
  if (page.startsWith('lesson-')) {
    return `/learn/${page.slice(7)}`;
  }

  if (page.startsWith('quiz-')) {
    return `/chapters/${page.slice(5)}/quiz`;
  }

  if (page.startsWith('project-')) {
    return `/chapters/${page.slice(8)}/project`;
  }

  throw new Error(`未知教程页面：${page}`);
}

export function coursePages(documents: ReturnType<typeof buildDocuments>) {
  const pages: Record<string, string[]> = {};

  for (const chapter of documents.chapters) {
    for (const lesson of chapter.lessons) {
      pages[`lesson-${lesson.id}`] = [
        lesson.document!,
        ...(documents.lessonGuides[lesson.id] ?? []).map(guide => guide.document),
      ];
    }

    pages[`quiz-${chapter.id}`] = chapter.questions.map(question => question.document!);
    pages[`project-${chapter.id}`] = [chapter.project.document!];
  }

  return pages;
}
