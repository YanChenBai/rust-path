import { computed, ref, onBeforeUnmount, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import { progress, recordActivity, importProgress, restoreProgress } from '../progress';
import type { chapters } from '../runtime/course';
import { applyWorkspaceRoute, workspacePath } from '../runtime/course-routes';
import { pageAnimationsReady } from '../runtime/page-animation';
import { useCurrentLesson } from './useCurrentLesson';

export function useLearningWorkspace() {
  const router = useRouter();

  onMounted(() => {
    const route = router.currentRoute.value;
    restoreProgress();

    // 根地址延续上次学习位置；明确的课程 URL 优先于本地导航记录。
    if (route.path !== '/' && !route.meta.notFound) {
      applyWorkspaceRoute(route, progress);
    }

    if (!route.meta.notFound) {
      void router.replace(workspacePath(progress));
    }

    pageAnimationsReady.value = true;
  });

  watch(
    () => [progress.page, progress.lesson, progress.tab],
    () => {
      if (!pageAnimationsReady.value || router.currentRoute.value.meta.notFound) {
        return;
      }

      const path = workspacePath(progress);

      if (path !== router.currentRoute.value.path) {
        void router.push(path);
      }
    },
    { flush: 'post' },
  );

  const playgroundCode = `fn main() {
    let possibilities = ["一个新想法", "一次小实验", "一个新发现"];
    for (i, idea) in possibilities.iter().enumerate() {
        println!("{}. {}", i + 1, idea);
    }
    println!("保持好奇，继续创造。");
}`;

  function openChapterSection(c: (typeof chapters)[number], tab: 'quiz' | 'project') {
    if (!c.lessons.some(l => l.id === progress.lesson)) {
      navigate(c.lessons[0]!.id);
    }

    progress.page = 'learn';
    section.value = tab;
    sidebar.value = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  const sidebar = ref(false);

  const section = computed({
    get: () => progress.tab,
    set: value => {
      progress.tab = value;
    },
  });

  const showSearch = ref(false);

  const showHelp = ref(false);

  const notice = ref('');

  let noticeTimer: ReturnType<typeof setTimeout> | undefined;

  const { chapter, lesson, localIndex, lessonDone } = useCurrentLesson();

  function notify(message: string) {
    notice.value = message;
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => {
      notice.value = '';
    }, 4500);
  }

  function navigate(id: string) {
    progress.lesson = id;
    progress.page = 'learn';
    section.value = 'lesson';
    sidebar.value = false;
    showSearch.value = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function page(value: typeof progress.page) {
    progress.page = value;
    sidebar.value = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function finish() {
    if (!progress.ran.includes(lesson.value.id)) {
      notify('先运行一次示例，再把这个知识点收入囊中。');
      return;
    }

    if (!lessonDone.value) {
      progress.completed.push(lesson.value.id);
      recordActivity();
      notify('一个小小的进步，值得被记录。+20 XP');
    }

    if (localIndex.value < chapter.value.lessons.length - 1) {
      navigate(chapter.value.lessons[localIndex.value + 1]!.id);
    } else {
      section.value = 'quiz';
    }
  }

  async function onImport(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      if (confirm('将使用导入文件替换当前浏览器的学习记录，继续吗？')) {
        await importProgress(file);
        notify('学习记录已恢复，欢迎回来。');
      }
    } catch (error) {
      notify(error instanceof Error ? error.message : '导入失败');
    }

    input.value = '';
  }

  onBeforeUnmount(() => clearTimeout(noticeTimer));

  return {
    playgroundCode,
    openChapterSection,
    sidebar,
    section,
    showSearch,
    showHelp,
    notice,
    chapter,
    lesson,
    notify,
    navigate,
    page,
    finish,
    onImport,
  };
}
