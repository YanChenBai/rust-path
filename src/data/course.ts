import documents from 'virtual:course-catalog';

import migration from './course-migration.json';

export type { Chapter, Lesson, Question } from './course-types';

export const { chapters, lessonGuides } = documents;

export const allLessons = chapters.flatMap(chapter => chapter.lessons);

export const { legacyChapters, sources } = migration;
