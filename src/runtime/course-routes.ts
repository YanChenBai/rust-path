import type { RouteRecordRaw, RouteLocationNormalizedLoaded } from 'vue-router';

import type { Progress } from '../progress';
import { allLessons, chapters } from './course';

const RoutePage = { render: () => null };

export const lessonPath = (id: string) => `/learn/${id}`;

export const routes: RouteRecordRaw[] = [
  { path: '/', component: RoutePage, meta: { page: 'learn', lesson: 'hello', tab: 'lesson' } },
  ...allLessons.map(lesson => ({
    path: lessonPath(lesson.id),
    component: RoutePage,
    meta: { page: 'learn', lesson: lesson.id, tab: 'lesson' },
  })),
  ...chapters.flatMap(chapter =>
    (['quiz', 'project'] as const).map(tab => ({
      path: `/chapters/${chapter.id}/${tab}`,
      component: RoutePage,
      meta: { page: 'learn', lesson: chapter.lessons[0]!.id, tab },
    })),
  ),
  ...(['path', 'playground', 'progress'] as const).map(page => ({
    path: `/${page}`,
    component: RoutePage,
    meta: { page, lesson: 'hello', tab: 'lesson' },
  })),
  { path: '/404', component: RoutePage, meta: { notFound: true } },
  { path: '/:pathMatch(.*)*', component: RoutePage, meta: { notFound: true } },
];

export function routeState(route: Pick<RouteLocationNormalizedLoaded, 'meta'>) {
  return {
    page: (route.meta.page ?? 'learn') as Progress['page'],
    lesson: (route.meta.lesson ?? 'hello') as string,
    tab: (route.meta.tab ?? 'lesson') as Progress['tab'],
  };
}

export function workspacePath(state: Pick<Progress, 'page' | 'lesson' | 'tab'>) {
  if (state.page !== 'learn') {
    return `/${state.page}`;
  }

  if (state.tab !== 'lesson') {
    const chapter = chapters.find(item => item.lessons.some(lesson => lesson.id === state.lesson));
    return `/chapters/${chapter!.id}/${state.tab}`;
  }

  return lessonPath(state.lesson);
}

export function applyWorkspaceRoute(
  route: Pick<RouteLocationNormalizedLoaded, 'meta'>,
  state: Pick<Progress, 'page' | 'lesson' | 'tab'>,
) {
  if (route.meta.notFound) {
    return;
  }

  const next = routeState(route);

  if (next.page === 'learn') {
    Object.assign(state, next);
    return;
  }

  state.page = next.page;
}
