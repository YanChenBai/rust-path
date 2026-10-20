import { describe, expect, it } from 'vite-plus/test';

import { allLessons, chapters } from './course';
import {
  lessonPath,
  routes,
  routeState,
  workspacePath,
  applyWorkspaceRoute,
} from './course-routes';

describe('静态课程路由', () => {
  it('错误地址不覆盖侧边栏保存的学习位置', () => {
    const state = { page: 'learn' as const, lesson: 'bindings', tab: 'quiz' as const };
    applyWorkspaceRoute({ meta: { notFound: true } }, state);
    expect(state).toEqual({ page: 'learn', lesson: 'bindings', tab: 'quiz' });
  });
  it('切换辅助页面保留继续学习的位置，课程链接覆盖该位置', () => {
    const state = { page: 'learn' as const, lesson: 'bindings', tab: 'quiz' as const };
    applyWorkspaceRoute({ meta: { page: 'path' } }, state);
    expect(state).toEqual({ page: 'path', lesson: 'bindings', tab: 'quiz' });
    applyWorkspaceRoute({ meta: { page: 'learn', lesson: 'hello', tab: 'lesson' } }, state);
    expect(state).toEqual({ page: 'learn', lesson: 'hello', tab: 'lesson' });
  });
  it('每节课程与章节挑战都能从地址恢复工作区', () => {
    for (const lesson of allLessons) {
      const route = routes.find(item => item.path === lessonPath(lesson.id))!;
      const state = routeState({ meta: route.meta! });
      expect(state).toEqual({ page: 'learn', lesson: lesson.id, tab: 'lesson' });
      expect(workspacePath(state)).toBe(route.path);
    }

    for (const chapter of chapters) {
      for (const tab of ['quiz', 'project'] as const) {
        const path = workspacePath({ page: 'learn', lesson: chapter.lessons.at(-1)!.id, tab });
        const route = routes.find(item => item.path === path)!;
        expect(routeState({ meta: route.meta! })).toEqual({
          page: 'learn',
          lesson: chapter.lessons[0]!.id,
          tab,
        });
      }
    }
  });

  it('学习路线、实验室和足迹使用独立地址', () => {
    for (const page of ['path', 'playground', 'progress'] as const) {
      expect(workspacePath({ page, lesson: 'hello', tab: 'lesson' })).toBe(`/${page}`);
    }
  });
});
