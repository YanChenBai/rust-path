import { computed, ref } from 'vue';

import { chapters } from '../data/course';

export function useCourseSearch() {
  const search = ref('');

  const searchResults = computed(() =>
    chapters
      .flatMap(c => c.lessons.map(l => ({ ...l, chapter: c.title })))
      .filter(l =>
        `${l.title}${l.subtitle}${l.detail}`.toLowerCase().includes(search.value.toLowerCase()),
      ),
  );

  return { search, searchResults };
}
