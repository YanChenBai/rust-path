import { createPinia } from 'pinia';
import { ViteSSG } from 'vite-ssg';

import App from './App.vue';
import CourseCallout from './components/docs/CourseCallout.vue';
import LessonGuides from './components/docs/LessonGuides.vue';
import MarkdownCode from './components/docs/MarkdownCode.vue';
import { prepareProgressHydration, progress } from './progress';
import { routes, applyWorkspaceRoute } from './runtime/course-routes';

import './style.css';

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { left: 0, top: 0 },
  },
  ({ app, router }) => {
    prepareProgressHydration();
    app.use(createPinia());
    app.component('CourseCallout', CourseCallout);
    app.component('LessonGuides', LessonGuides);
    app.component('MarkdownCode', MarkdownCode);
    router.afterEach((to, _from, failure) => {
      if (!failure) {
        applyWorkspaceRoute(to, progress);
      }
    });
  },
  { hydration: true },
);
