import documents from 'virtual:course-pages';
import { computed, defineAsyncComponent } from 'vue';

const components = Object.fromEntries(
  Object.entries(documents).map(([path, load]) => [path, defineAsyncComponent(load)]),
);

export function useCourseDocument(path: () => string) {
  return computed(() => components[path()]);
}
