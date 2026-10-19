import { computed, defineAsyncComponent } from 'vue';

const documents = import.meta.glob('../docs/**/*.md');

const components = Object.fromEntries(
  Object.entries(documents).map(([path, load]) => [
    path.replace('../docs/', ''),
    defineAsyncComponent(load as Parameters<typeof defineAsyncComponent>[0]),
  ]),
);

export function useCourseDocument(path: () => string) {
  return computed(() => components[path()]);
}
