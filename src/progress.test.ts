import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';

const storageKey = 'rust-path:progress:v1';

function createMemoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear() {
      values.clear();
    },
    getItem(key: string) {
      return values.get(String(key)) ?? null;
    },
    key(index: number) {
      return [...values.keys()][index] ?? null;
    },
    removeItem(key: string) {
      values.delete(String(key));
    },
    setItem(key: string, value: string) {
      values.set(String(key), String(value));
    },
  };
}

// 保留升级前的必需字段，刻意不写后续增加的编辑器、反馈等字段。
function legacyRecord() {
  return {
    version: 1,
    lesson: 'hello',
    page: 'learn',
    drafts: { hello: 'fn main() { println!("保留草稿"); }', 'start-code': 'fn greeting() {}' },
    answers: { 'start-choice': 'main()' },
    attempts: { 'start-choice': 2, 'start-code': 3 },
    passed: ['start-choice'],
    completed: ['hello'],
    ran: ['hello'],
    activity: { '2026-10-18': 2 },
    notes: { hello: '保留笔记' },
  };
}

function backup(value: unknown): File {
  return new File([JSON.stringify(value)], 'progress.json', { type: 'application/json' });
}

async function flushProgress() {
  const { nextTick } = await import('vue');
  await nextTick();
}

let memory: Storage;

beforeEach(() => {
  vi.resetModules();
  memory = createMemoryStorage();
  vi.stubGlobal('localStorage', memory);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('学习进度', () => {
  it('首次加载使用空记录，完成度与 XP 为零', async () => {
    const { progress, xp, completedSteps, percentage } = await import('./progress');
    expect(progress.drafts).toEqual({});
    expect(progress.completed).toEqual([]);
    expect(progress.passed).toEqual([]);
    expect(xp.value).toBe(0);
    expect(completedSteps.value).toBe(0);
    expect(percentage.value).toBe(0);
  });

  it('迁移旧本地记录时保留草稿、尝试、完成记录，并补齐新增字段', async () => {
    const old = legacyRecord();
    memory.setItem(storageKey, JSON.stringify(old));
    const { progress, storage } = await import('./progress');
    expect(progress).toMatchObject(old);
    expect(progress).toMatchObject({
      sidebarCollapsed: false,
      focusMode: false,
      tab: 'lesson',
      questions: {},
      outputs: {},
      revealed: [],
      dependencies: [],
      editorDependencies: {},
      editorLayouts: {},
      feedback: {},
    });
    expect(storage.error).toBe('');
    expect(progress.chapterNotes.start).toBe('## 你好，Rust\n\n保留笔记');
  });

  it('编辑嵌套字段后自动存储，重新加载仍保留这些改动', async () => {
    const { progress, storage } = await import('./progress');
    progress.drafts.hello = 'fn main() { println!("新的草稿"); }';
    progress.attempts['start-code'] = 4;
    progress.completed.push('hello');
    progress.editorLayouts.hello = 'horizontal';
    progress.editorDependencies.hello = ['serde_json'];
    progress.feedback['start-code'] = { success: false, message: '再试一次' };
    await flushProgress();

    const saved = memory.getItem(storageKey);
    expect(saved).not.toBeNull();
    expect(JSON.parse(saved ?? 'null')).toEqual(JSON.parse(JSON.stringify(progress)));
    expect(storage.error).toBe('');
    expect(storage.savedAt).not.toBe('');

    vi.resetModules();
    const reloaded = await import('./progress');
    expect(reloaded.progress).toEqual(JSON.parse(saved ?? 'null'));
  });

  it('有效备份可完整导入并自动持久化', async () => {
    const { progress, importProgress } = await import('./progress');
    progress.drafts.hello = '应被替换的草稿';

    const record = {
      ...legacyRecord(),
      curriculumVersion: 2,
      archivedPassed: [],
      page: 'progress',
      focusMode: true,
      sidebarCollapsed: true,
      tab: 'quiz',
      questions: { start: 7 },
      outputs: { hello: { success: true, stdout: 'ok\n', stderr: '', elapsed: 12 } },
      revealed: ['start-code'],
      dependencies: ['serde_json'],
      editorDependencies: { hello: ['serde_json'] },
      editorLayouts: { hello: 'horizontal' },
      editorCommentsHidden: { hello: true },
      editorSplits: { hello: { vertical: 0.55, horizontal: 0.7 } },
      editorHeights: { hello: 720 },
      chapterNotes: { start: '## 我的理解\n\n**重点**：入口是 main。' },
      annotations: {
        hello: [
          {
            id: 'note-1',
            quote: 'Rust',
            prefix: '',
            suffix: ' 程序',
            start: 0,
            end: 4,
            body: '**入口**',
            createdAt: 1,
          },
        ],
      },
      feedback: { 'start-code': { success: true, message: '通过' } },
    };

    await importProgress(backup(record));
    await flushProgress();
    expect(progress).toEqual(record);
    expect(JSON.parse(memory.getItem(storageKey) ?? 'null')).toEqual(record);
  });

  it('导入旧备份时补默认值，不残留上一份记录的新字段', async () => {
    const { progress, importProgress } = await import('./progress');
    progress.focusMode = true;
    progress.feedback['start-code'] = { success: true, message: '旧反馈' };
    progress.editorLayouts.hello = 'horizontal';
    await importProgress(backup(legacyRecord()));
    expect(progress).toMatchObject(legacyRecord());
    expect(progress.focusMode).toBe(false);
    expect(progress.feedback).toEqual({});
    expect(progress.editorLayouts).toEqual({});
  });

  it.each([
    ['空对象', {}],
    ['null', null],
    ['数组', []],
    ['未知版本', { ...legacyRecord(), version: 2 }],
    ['缺少必需字段', { version: 1, drafts: {} }],
    ['草稿类型错误', { ...legacyRecord(), drafts: { hello: 123 } }],
    ['尝试次数为负数', { ...legacyRecord(), attempts: { 'start-code': -1 } }],
    ['尝试次数为小数', { ...legacyRecord(), attempts: { 'start-code': 1.5 } }],
    [
      '尝试次数不安全',
      { ...legacyRecord(), attempts: { 'start-code': Number.MAX_SAFE_INTEGER + 1 } },
    ],
    ['完成列表类型错误', { ...legacyRecord(), completed: 'hello' }],
    ['通过列表元素错误', { ...legacyRecord(), passed: [1] }],
    ['页面枚举错误', { ...legacyRecord(), page: 'invalid' }],
    ['当前课时不存在', { ...legacyRecord(), lesson: 'unknown-lesson' }],
    ['开关类型错误', { ...legacyRecord(), focusMode: 'true' }],
    ['题号类型错误', { ...legacyRecord(), questions: { start: -1 } }],
    ['输出对象不完整', { ...legacyRecord(), outputs: { hello: { success: true } } }],
    [
      '耗时非法',
      {
        ...legacyRecord(),
        outputs: { hello: { success: true, stdout: '', stderr: '', elapsed: -1 } },
      },
    ],
    [
      '反馈类型错误',
      { ...legacyRecord(), feedback: { 'start-code': { success: 'true', message: 'ok' } } },
    ],
    ['依赖不在白名单', { ...legacyRecord(), dependencies: ['unknown-crate'] }],
    ['编辑器依赖不是数组', { ...legacyRecord(), editorDependencies: { hello: 'tokio' } }],
    ['布局枚举错误', { ...legacyRecord(), editorLayouts: { hello: 'diagonal' } }],
    ['编辑器高度过小', { ...legacyRecord(), editorHeights: { hello: 100 } }],
    ['编辑器高度过大', { ...legacyRecord(), editorHeights: { hello: 12001 } }],
    ['编辑器高度类型错误', { ...legacyRecord(), editorHeights: { hello: '720px' } }],
    [
      '注释引文偏移不一致',
      {
        ...legacyRecord(),
        annotations: {
          hello: [
            {
              id: 'a',
              quote: 'Rust',
              prefix: '',
              suffix: '',
              start: 0,
              end: 2,
              body: '笔记',
              createdAt: 1,
            },
          ],
        },
      },
    ],
    [
      '注释正文类型错误',
      {
        ...legacyRecord(),
        annotations: {
          hello: [
            {
              id: 'a',
              quote: 'Rust',
              prefix: '',
              suffix: '',
              start: 0,
              end: 4,
              body: 42,
              createdAt: 1,
            },
          ],
        },
      },
    ],
  ])('拒绝%s的备份，同时保留内存及本地原记录', async (_label, invalid) => {
    const { progress, importProgress } = await import('./progress');
    await importProgress(backup(legacyRecord()));
    await flushProgress();
    const before = JSON.stringify(progress);
    const savedBefore = memory.getItem(storageKey);

    await expect(importProgress(backup(invalid))).rejects.toThrow();
    await flushProgress();
    expect(JSON.stringify(progress)).toBe(before);
    expect(memory.getItem(storageKey)).toBe(savedBefore);
  });

  it('拒绝损坏的 JSON 和超大备份，不破坏已有记录', async () => {
    const { progress, importProgress } = await import('./progress');
    await importProgress(backup(legacyRecord()));
    await flushProgress();
    const before = JSON.stringify(progress);
    const savedBefore = memory.getItem(storageKey);

    const files = [
      new File(['{"version":'], 'broken.json'),
      new File([' '.repeat(5_000_001)], 'oversized.json'),
    ];

    for (const file of files) {
      await expect(importProgress(file)).rejects.toThrow();
      await flushProgress();
      expect(JSON.stringify(progress)).toBe(before);
      expect(memory.getItem(storageKey)).toBe(savedBefore);
    }
  });

  it('损坏的本地记录回退默认状态但保留原始备份，并报告错误', async () => {
    const raw = '{broken-json';
    memory.setItem(storageKey, raw);
    const { progress, storage } = await import('./progress');
    expect(progress.completed).toEqual([]);
    expect(progress.drafts).toEqual({});
    expect(storage.error).not.toBe('');
    expect(memory.getItem(storageKey)).toBe(raw);
  });

  it('重复与未知 ID 不增加 XP 或完成步数', async () => {
    const { progress, xp, completedSteps, percentage } = await import('./progress');
    progress.completed = ['hello'];
    progress.passed = ['start-choice', 'start-code', 'start-project'];
    expect(xp.value).toBe(180);
    expect(completedSteps.value).toBe(4);
    const before = percentage.value;

    progress.completed.push('hello', 'hello', 'unknown-lesson');
    progress.passed.push(
      'start-choice',
      'start-code',
      'start-project',
      'unknown-question',
      'hello',
    );
    expect(xp.value).toBe(180);
    expect(completedSteps.value).toBe(4);
    expect(percentage.value).toBe(before);
  });

  it('重复 ID 的备份导入后去重，XP 和进度不被放大', async () => {
    const { progress, importProgress, xp, completedSteps } = await import('./progress');
    await importProgress(
      backup({
        ...legacyRecord(),
        completed: ['hello', 'hello', 'unknown-lesson'],
        passed: ['start-choice', 'start-choice', 'start-project', 'unknown-question'],
      }),
    );
    expect(progress.completed).toEqual(['hello']);
    expect(progress.passed).toEqual(['start-choice', 'start-project']);
    expect(xp.value).toBe(150);
    expect(completedSteps.value).toBe(3);
  });
  it('拆章后保留课时草稿与笔记，把旧题和改写项目通过状态归档', async () => {
    memory.setItem(
      storageKey,
      JSON.stringify({
        ...legacyRecord(),
        lesson: 'borrow',
        completed: ['move', 'borrow'],
        drafts: { borrow: '原借用草稿', 'ownership-code': '旧题草稿' },
        notes: { borrow: '原借用笔记' },
        passed: ['ownership-choice', 'ownership-project', 'start-choice'],
        attempts: { 'ownership-code': 2 },
        questions: { ownership: 7 },
      }),
    );
    const { progress, xp } = await import('./progress');
    expect(progress.lesson).toBe('borrow');
    expect(progress.drafts.borrow).toBe('原借用草稿');
    expect(progress.drafts['ownership-code']).toBe('旧题草稿');
    expect(progress.notes.borrow).toBe('原借用笔记');
    expect(progress.completed).toEqual(['move', 'borrow']);
    expect(progress.passed).toEqual(['start-choice']);
    expect(progress.archivedPassed).toEqual(['ownership-choice', 'ownership-project']);
    expect(progress.attempts['ownership-code']).toBe(2);
    expect(progress.questions.ownership).toBeUndefined();
    expect(xp.value).toBe(70);
    await flushProgress();
    vi.resetModules();
    const reloaded = await import('./progress');
    expect(reloaded.progress.archivedPassed).toEqual(progress.archivedPassed);
  });

  it('新版备份保留新题通过、SQLite 依赖和旧成绩归档', async () => {
    const { progress, importProgress } = await import('./progress');
    await importProgress(
      backup({
        ...legacyRecord(),
        curriculumVersion: 2,
        passed: ['strings-r2-choice-1'],
        archivedPassed: ['ownership-project'],
        dependencies: ['rusqlite'],
        editorDependencies: { 'sqlite-parameters': ['rusqlite'] },
        questions: { strings: 6 },
      }),
    );
    expect(progress.passed).toEqual(['strings-r2-choice-1']);
    expect(progress.archivedPassed).toEqual(['ownership-project']);
    expect(progress.dependencies).toEqual(['rusqlite']);
    expect(progress.questions.strings).toBe(6);
  });
  it('章节完成率使用实际题目数量，8 题全部通过且项目完成时恰好 100%', async () => {
    const { progress, chapterCompletion } = await import('./progress');
    const { chapters } = await import('./data/course');
    const chapter = chapters[0]!;
    progress.completed = chapter.lessons.map(lesson => lesson.id);
    progress.passed = chapter.questions.map(question => question.id);
    expect(chapterCompletion(chapter.id)).toBeLessThan(100);
    progress.passed.push(`${chapter.id}-project`);
    expect(chapterCompletion(chapter.id)).toBe(100);
    progress.passed.push(...progress.passed);
    expect(chapterCompletion(chapter.id)).toBe(100);
    expect(chapterCompletion('unknown')).toBe(0);
  });
});
