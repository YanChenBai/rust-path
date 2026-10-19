import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';

import { progress, chapterCompletion as chapterPercent } from '../progress';
import { chapters } from '../runtime/course';

export function useCourseSidebar() {
  const expandedChapters = ref(
    new Set(chapters.filter(c => c.lessons.some(l => l.id === progress.lesson)).map(c => c.id)),
  );

  function toggleChapter(id: string) {
    const expanded = new Set(expandedChapters.value);

    if (expanded.has(id)) {
      expanded.delete(id);
    } else {
      expanded.add(id);
    }

    expandedChapters.value = expanded;
  }

  const sidebarScroller = ref<HTMLElement>();

  const sidebarTrack = ref<HTMLElement>();

  const sidebarThumb = ref({ top: 0, height: 100, visible: false });

  let sidebarObserver: ResizeObserver | undefined;

  function updateSidebarScroll() {
    const el = sidebarScroller.value;

    if (!el) {
      return;
    }

    const ratio = el.clientHeight / el.scrollHeight;
    sidebarThumb.value = {
      top: (el.scrollTop / el.scrollHeight) * 100,
      height: Math.max(6, ratio * 100),
      visible: ratio < 0.99,
    };
  }

  function dragSidebar(event: PointerEvent) {
    const el = sidebarScroller.value;
    const track = sidebarTrack.value;

    if (!el || !track) {
      return;
    }

    event.preventDefault();
    const start = event.clientY;
    const scroll = el.scrollTop;

    const move = (next: PointerEvent) => {
      el.scrollTop = scroll + ((next.clientY - start) / track.clientHeight) * el.scrollHeight;
    };

    const end = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end, { once: true });
  }

  onMounted(() => {
    sidebarObserver = new ResizeObserver(updateSidebarScroll);

    if (sidebarScroller.value) {
      sidebarObserver.observe(sidebarScroller.value);
    }

    updateSidebarScroll();
  });

  onBeforeUnmount(() => sidebarObserver?.disconnect());

  watch(
    () => [progress.lesson, progress.page, progress.sidebarCollapsed],
    () => void nextTick(updateSidebarScroll),
  );

  watch(
    () => progress.lesson,
    () => {
      const current = chapters.find(chapter =>
        chapter.lessons.some(lesson => lesson.id === progress.lesson),
      );

      if (current) {
        expandedChapters.value = new Set([...expandedChapters.value, current.id]);
      }
    },
  );

  const isChapterUnlocked = (chapter: (typeof chapters)[number]) =>
    chapter.questions.every(question => progress.passed.includes(question.id));

  return {
    expandedChapters,
    toggleChapter,
    sidebarScroller,
    sidebarTrack,
    sidebarThumb,
    updateSidebarScroll,
    dragSidebar,
    isChapterUnlocked,
    chapterPercent,
  };
}
