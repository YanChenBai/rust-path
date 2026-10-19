import documents from 'virtual:course-catalog';

import references from '../docs/references.json';
import migration from './course-migration.json';

export type { Chapter, Lesson, Question } from './course-types';

export const { chapters, lessonGuides, revisedLegacyIds } = documents;

export const allLessons = chapters.flatMap(chapter => chapter.lessons);

export const curriculumOrder = chapters.map(chapter => chapter.id);

// 仅保留旧学习记录迁移所需的历史快照；当前课程内容来自 docs。
export const { legacyChapters } = migration;

export const sources = references;
