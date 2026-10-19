import { computed, reactive, watch } from 'vue';

import { allLessons, chapters, legacyChapters } from './runtime/course';
import { revisedLegacyIds } from './runtime/course';
import { lessonGuides } from './runtime/course';
import type { RunResult } from './runtime/rust';
import type { TextAnnotation } from './runtime/text-annotations';

export interface Progress {
  version: 1;
  curriculumVersion: 2;
  archivedPassed: string[];
  sidebarCollapsed: boolean;
  focusMode: boolean;
  lesson: string;
  page: 'learn' | 'path' | 'playground' | 'progress';
  drafts: Record<string, string>;
  answers: Record<string, string>;
  attempts: Record<string, number>;
  passed: string[];
  completed: string[];
  ran: string[];
  activity: Record<string, number>;
  notes: Record<string, string>;
  chapterNotes: Record<string, string>;
  annotations: Record<string, TextAnnotation[]>;
  tab: 'lesson' | 'quiz' | 'project';
  questions: Record<string, number>;
  outputs: Record<string, RunResult>;
  revealed: string[];
  dependencies: string[];
  editorDependencies: Record<string, string[]>;
  editorCommentsHidden: Record<string, boolean>;
  editorLayouts: Record<string, 'vertical' | 'horizontal'>;
  editorSplits: Record<string, { vertical: number; horizontal: number }>;
  editorHeights: Record<string, number>;
  feedback: Record<string, { success: boolean; message: string }>;
}
const key = 'rust-path:progress:v1';

const initial = (): Progress => ({
  version: 1,
  curriculumVersion: 2,
  archivedPassed: [],
  sidebarCollapsed: false,
  focusMode: false,
  lesson: 'hello',
  page: 'learn',
  drafts: {},
  answers: {},
  attempts: {},
  passed: [],
  completed: [],
  ran: [],
  activity: {},
  notes: {},
  chapterNotes: {},
  annotations: {},
  tab: 'lesson',
  questions: {},
  outputs: {},
  revealed: [],
  dependencies: [],
  editorDependencies: {},
  editorCommentsHidden: {},
  editorLayouts: {},
  editorSplits: {},
  editorHeights: {},
  feedback: {},
});

function previousSaveTime() {
  try {
    return localStorage.getItem(`${key}:saved-at`) ?? '';
  } catch {
    return '';
  }
}

export const storage = reactive({ error: '', savedAt: previousSaveTime() });

type Validator = (value: unknown) => boolean;

const lessonIds = new Set(allLessons.map(lesson => lesson.id));

const questionIds = new Set(
  chapters.flatMap(chapter => chapter.questions.map(question => question.id)),
);

const projectIds = new Set(chapters.map(chapter => `${chapter.id}-project`));
const assessmentIds = new Set([...questionIds, ...projectIds]);

const legacyAssessmentIds = new Set(
  legacyChapters.flatMap(chapter => [
    ...chapter.questions.map(question => question.id),
    `${chapter.id}-project`,
  ]),
);

const storedAssessmentIds = new Set([...assessmentIds, ...legacyAssessmentIds]);
const replacedProjects = new Set(revisedLegacyIds.map(id => `${id}-project`));

const editorIds = new Set([
  ...lessonIds,
  ...storedAssessmentIds,
  'playground',
  ...allLessons.flatMap(lesson =>
    (lessonGuides[lesson.id] ?? []).flatMap((guide, index) =>
      guide.code ? [`${lesson.id}-guide-${index}`] : [],
    ),
  ),
]);

const dependencyNames = new Set([
  'tokio',
  'serde',
  'serde_json',
  'anyhow',
  'thiserror',
  'reqwest',
  'clap',
  'tracing',
  'rusqlite',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

const isString: Validator = value => typeof value === 'string';
const isBoolean: Validator = value => typeof value === 'boolean';
const isCount: Validator = value => Number.isSafeInteger(value) && Number(value) >= 0;
const isStringList: Validator = value => Array.isArray(value) && value.every(isString);

function recordOf(validate: Validator): Validator {
  return value => isRecord(value) && Object.values(value).every(validate);
}

function oneOf(values: readonly unknown[]): Validator {
  return value => values.includes(value);
}

function isDependencyList(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(name => typeof name === 'string' && dependencyNames.has(name))
  );
}

function isFeedback(value: unknown): boolean {
  return isRecord(value) && isBoolean(value.success) && isString(value.message);
}

function isOutput(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  if (value.transcript !== undefined && !isString(value.transcript)) {
    return false;
  }

  return (
    isBoolean(value.success) &&
    isString(value.stdout) &&
    isString(value.stderr) &&
    typeof value.elapsed === 'number' &&
    Number.isFinite(value.elapsed) &&
    value.elapsed >= 0
  );
}

function isAnnotation(value: unknown): value is TextAnnotation {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    typeof value.quote === 'string' &&
    value.quote.length > 0 &&
    value.quote.length <= 2000 &&
    typeof value.prefix === 'string' &&
    value.prefix.length <= 64 &&
    typeof value.suffix === 'string' &&
    value.suffix.length <= 64 &&
    typeof value.body === 'string' &&
    value.body.length <= 20000 &&
    Number.isInteger(value.start) &&
    Number(value.start) >= 0 &&
    Number.isInteger(value.end) &&
    Number(value.end) > Number(value.start) &&
    value.end === Number(value.start) + value.quote.length &&
    typeof value.createdAt === 'number' &&
    Number.isFinite(value.createdAt) &&
    value.createdAt >= 0
  );
}

const validators: Record<keyof Progress, Validator> = {
  version: oneOf([1]),
  curriculumVersion: oneOf([2]),
  archivedPassed: isStringList,
  sidebarCollapsed: isBoolean,
  focusMode: isBoolean,
  lesson: value => typeof value === 'string' && lessonIds.has(value),
  page: oneOf(['learn', 'path', 'playground', 'progress']),
  drafts: recordOf(isString),
  answers: recordOf(isString),
  attempts: recordOf(isCount),
  passed: isStringList,
  completed: isStringList,
  ran: isStringList,
  activity: recordOf(isCount),
  notes: recordOf(isString),
  chapterNotes: recordOf(isString),
  annotations: recordOf(value => Array.isArray(value) && value.every(isAnnotation)),
  tab: oneOf(['lesson', 'quiz', 'project']),
  questions: recordOf(isCount),
  outputs: recordOf(isOutput),
  revealed: isStringList,
  dependencies: isDependencyList,
  editorDependencies: recordOf(isDependencyList),
  editorCommentsHidden: recordOf(isBoolean),
  editorHeights: recordOf(
    value => typeof value === 'number' && Number.isFinite(value) && value >= 260 && value <= 12000,
  ),
  editorLayouts: recordOf(oneOf(['vertical', 'horizontal'])),
  editorSplits: recordOf(
    value =>
      isRecord(value) &&
      [value.vertical, value.horizontal].every(
        n => typeof n === 'number' && Number.isFinite(n) && n >= 0.15 && n <= 0.85,
      ),
  ),
  feedback: recordOf(isFeedback),
};

const requiredFields: (keyof Progress)[] = [
  'version',
  'lesson',
  'page',
  'drafts',
  'answers',
  'attempts',
  'passed',
  'completed',
  'ran',
  'activity',
  'notes',
];

function valid(value: unknown): value is Partial<Progress> {
  if (!isRecord(value) || !requiredFields.every(field => Object.hasOwn(value, field))) {
    return false;
  }

  return Object.entries(validators).every(
    ([field, validate]) => value[field] === undefined || validate(value[field]),
  );
}

function uniqueIds(values: string[], allowed: Set<string>): string[] {
  return [...new Set(values.filter(id => allowed.has(id)))];
}

function filterRecord<T>(values: Record<string, T>, allowed: Set<string>): Record<string, T> {
  return Object.fromEntries(Object.entries(values).filter(([id]) => allowed.has(id)));
}

function validActivityDate(day: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    return false;
  }

  const date = new Date(`${day}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === day;
}

function migrate(data: Partial<Progress>): Progress {
  const defaults = initial();

  const merged = Object.fromEntries(
    Object.entries(defaults).map(([field, fallback]) => [
      field,
      data[field as keyof Progress] ?? fallback,
    ]),
  ) as unknown as Progress;

  if (data.curriculumVersion !== 2) {
    const retired = merged.passed.filter(id => !assessmentIds.has(id) || replacedProjects.has(id));
    merged.archivedPassed = uniqueIds([...merged.archivedPassed, ...retired], storedAssessmentIds);
    merged.passed = merged.passed.filter(id => !retired.includes(id));

    // 已换题的章节不能沿用旧位置，以免把原第 N 题误当成新第 N 题。
    for (const id of revisedLegacyIds) {
      delete merged.questions[id];
    }
  }

  merged.completed = uniqueIds(merged.completed, lessonIds);
  merged.passed = uniqueIds(merged.passed, assessmentIds);
  merged.archivedPassed = uniqueIds(merged.archivedPassed, storedAssessmentIds);
  merged.ran = uniqueIds(merged.ran, editorIds);
  merged.revealed = uniqueIds(merged.revealed, storedAssessmentIds);
  merged.dependencies = [...new Set(merged.dependencies)];
  merged.drafts = filterRecord(merged.drafts, editorIds);
  merged.answers = filterRecord(merged.answers, storedAssessmentIds);
  merged.attempts = filterRecord(merged.attempts, storedAssessmentIds);
  merged.notes = filterRecord(merged.notes, lessonIds);
  merged.chapterNotes = filterRecord(
    merged.chapterNotes,
    new Set(chapters.map(chapter => chapter.id)),
  );
  merged.annotations = filterRecord(merged.annotations, lessonIds);

  if (data.chapterNotes === undefined) {
    for (const chapter of chapters) {
      const notes = chapter.lessons
        .filter(lesson => merged.notes[lesson.id]?.trim())
        .map(lesson => `## ${lesson.title}\n\n${merged.notes[lesson.id]}`);

      if (notes.length) {
        merged.chapterNotes[chapter.id] = notes.join('\n\n');
      }
    }
  }

  merged.feedback = filterRecord(merged.feedback, storedAssessmentIds);
  merged.outputs = filterRecord(merged.outputs, editorIds);
  merged.editorCommentsHidden = filterRecord(merged.editorCommentsHidden, editorIds);
  merged.editorLayouts = filterRecord(merged.editorLayouts, editorIds);
  merged.editorSplits = filterRecord(merged.editorSplits, editorIds);
  merged.editorHeights = filterRecord(merged.editorHeights, editorIds);
  merged.editorDependencies = Object.fromEntries(
    Object.entries(filterRecord(merged.editorDependencies, editorIds)).map(([id, selected]) => [
      id,
      [...new Set(selected)],
    ]),
  );
  merged.questions = Object.fromEntries(
    chapters.flatMap(chapter => {
      const index = merged.questions[chapter.id];
      return index !== undefined && index < chapter.questions.length ? [[chapter.id, index]] : [];
    }),
  );
  merged.activity = Object.fromEntries(
    Object.entries(merged.activity).filter(([day]) => validActivityDate(day)),
  );
  return merged;
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return initial();
    }

    const data: unknown = JSON.parse(raw);

    if (valid(data)) {
      return migrate(data);
    }

    storage.error = '旧记录格式不受支持，原始记录仍保留在浏览器中。';
  } catch {
    storage.error = '无法读取本地记录，当前变更可能无法保存。';
  }

  return initial();
}

export const progress = reactive(load());
watch(
  progress,
  () => {
    try {
      localStorage.setItem(key, JSON.stringify(progress));
      storage.error = '';
      storage.savedAt = new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      localStorage.setItem(`${key}:saved-at`, storage.savedAt);
    } catch {
      storage.error = '浏览器存储空间不足或已禁用，请导出记录备份。';
    }
  },
  { deep: true, flush: 'sync' },
);

export const xp = computed(
  () =>
    uniqueIds(progress.completed, lessonIds).length * 20 +
    uniqueIds(progress.passed, questionIds).length * 30 +
    uniqueIds(progress.passed, projectIds).length * 100,
);

export function chapterCompletion(chapterId: string): number {
  const chapter = chapters.find(item => item.id === chapterId);

  if (!chapter) {
    return 0;
  }

  const steps = [
    ...chapter.lessons.map(lesson => lesson.id),
    ...chapter.questions.map(question => question.id),
    `${chapter.id}-project`,
  ];

  const completed = new Set([...progress.completed, ...progress.passed]);
  return Math.round((steps.filter(id => completed.has(id)).length / steps.length) * 100);
}

export const totalSteps = allLessons.length + assessmentIds.size;

export const completedSteps = computed(
  () =>
    uniqueIds(progress.completed, lessonIds).length +
    uniqueIds(progress.passed, assessmentIds).length,
);

export const percentage = computed(() =>
  Math.min(100, Math.round((completedSteps.value / totalSteps) * 100)),
);

export const level = computed(() => Math.floor(xp.value / 200) + 1);

export function recordActivity() {
  const day = new Date().toLocaleDateString('en-CA');
  progress.activity[day] = (progress.activity[day] ?? 0) + 1;
}

export const streak = computed(() => {
  const date = new Date();
  let days = 0;

  if (!progress.activity[date.toLocaleDateString('en-CA')]) {
    date.setDate(date.getDate() - 1);
  }

  while (progress.activity[date.toLocaleDateString('en-CA')]) {
    days++;
    date.setDate(date.getDate() - 1);
  }

  return days;
});

export function exportProgress() {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' }),
  );

  const link = document.createElement('a');
  link.href = url;
  link.download = 'rust-path-progress.json';
  link.click();
  URL.revokeObjectURL(url);
}

export async function importProgress(file: File) {
  if (file.size > 5_000_000) {
    throw new Error('记录文件过大，请选择小于 5 MB 的 JSON。');
  }

  const data: unknown = JSON.parse(await file.text());

  if (!valid(data)) {
    throw new Error('这不是有效的 Rust Path 学习记录。');
  }

  Object.assign(progress, migrate(data));
}
