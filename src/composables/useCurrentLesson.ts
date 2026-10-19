import { computed } from 'vue';

import { progress } from '../progress';
import { chapters, allLessons } from '../runtime/course';

export function useCurrentLesson() {
  const chapter = computed(() =>
    chapters.find(c => c.lessons.some(l => l.id === progress.lesson))!,
  );

  const lesson = computed(() => allLessons.find(l => l.id === progress.lesson)!);

  const chapterIndex = computed(() => chapters.indexOf(chapter.value));

  const lessonIndex = computed(() => allLessons.indexOf(lesson.value));

  const localIndex = computed(() => chapter.value.lessons.indexOf(lesson.value));

  const projectUnlocked = computed(() =>
    chapter.value.questions.every(q => progress.passed.includes(q.id)),
  );

  const lessonDone = computed(() => progress.completed.includes(lesson.value.id));

  return { chapter, lesson, chapterIndex, lessonIndex, localIndex, projectUnlocked, lessonDone };
}
