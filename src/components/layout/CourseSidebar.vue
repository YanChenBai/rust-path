<script setup lang="ts">
import {
  BookOpen,
  Code2,
  ChartNoAxesCombined,
  ChevronRight,
  Check,
  LockKeyhole,
  CircleHelp,
  Sparkles,
  Route,
} from 'lucide-vue-next';

import { useCourseSidebar } from '../../composables/useCourseSidebar';
import { progress, percentage, completedSteps, totalSteps } from '../../progress';
import { chapters, type Chapter } from '../../runtime/course';
defineProps<{ open: boolean; currentChapterId: string }>();

const emit = defineEmits<{
  navigate: [id: string];
  page: [value: typeof progress.page];
  help: [];
  section: [chapter: Chapter, section: 'quiz' | 'project'];
}>();

const {
  sidebarScroller,
  sidebarTrack,
  sidebarThumb,
  updateSidebarScroll,
  dragSidebar,
  expandedChapters,
  toggleChapter,
  isChapterUnlocked,
  chapterPercent,
} = useCourseSidebar();
</script>
<template>
  <aside class="sidebar" :class="{ 'is-open': open }">
    <div class="sidebar-top">
      <nav class="workspace-nav" aria-label="主导航">
        <button
          :class="{ active: progress.page === 'learn' }"
          @click="emit('page', 'learn')"
          title="开始学习"
          aria-label="开始学习"
        >
          <BookOpen :size="18" /><span class="sr-only">开始学习</span>
        </button>
        <button
          :class="{ active: progress.page === 'path' }"
          @click="emit('page', 'path')"
          title="学习路线"
          aria-label="学习路线"
        >
          <Route :size="18" /><span class="sr-only">学习路线</span>
        </button>
        <button
          :class="{ active: progress.page === 'playground' }"
          @click="emit('page', 'playground')"
          title="代码实验室"
          aria-label="代码实验室"
        >
          <Code2 :size="18" /><span class="sr-only">代码实验室</span>
        </button>
        <button
          :class="{ active: progress.page === 'progress' }"
          @click="emit('page', 'progress')"
          title="学习足迹"
          aria-label="学习足迹"
        >
          <ChartNoAxesCombined :size="18" /><span class="sr-only">学习足迹</span>
        </button>
        <button @click="emit('help')" title="关于 Rust Path" aria-label="关于 Rust Path">
          <CircleHelp :size="18" /><span class="sr-only">关于 Rust Path</span>
        </button>
      </nav>
    </div>
    <div ref="sidebarScroller" class="sidebar-scroll" @scroll="updateSidebarScroll">
      <div class="course-label">
        <span class="sidebar-label">RUST 学习主线</span><span>{{ chapters.length }} 章</span>
      </div>
      <nav class="chapter-nav" aria-label="课程章节">
        <div v-for="c in chapters" :key="c.id" class="chapter-group">
          <div class="chapter-row">
            <button
              class="chapter-button"
              :class="{ current: currentChapterId === c.id && progress.page === 'learn' }"
              :aria-expanded="expandedChapters.has(c.id)"
              :aria-controls="'chapter-tree-' + c.id"
              @click="
                expandedChapters.add(c.id);
                emit('navigate', c.lessons[0]!.id);
              "
            >
              <span class="chapter-number" :class="{ finished: chapterPercent(c.id) === 100 }"
                ><Check v-if="chapterPercent(c.id) === 100" :size="12" /><template v-else>{{
                  c.icon
                }}</template></span
              ><span>{{ c.title }}</span></button
            ><button
              class="chapter-expander icon-button"
              :aria-label="(expandedChapters.has(c.id) ? '收起' : '展开') + c.title"
              :aria-expanded="expandedChapters.has(c.id)"
              @click="toggleChapter(c.id)"
            >
              <ChevronRight :size="13" :class="{ rotate: expandedChapters.has(c.id) }" />
            </button>
          </div>
          <Transition name="chapter-expand">
            <div
              v-if="expandedChapters.has(c.id)"
              :id="'chapter-tree-' + c.id"
              class="chapter-children"
            >
              <div class="chapter-clip">
                <div class="lesson-tree">
                  <button
                    v-for="l in c.lessons"
                    :key="l.id"
                    :class="{
                      selected:
                        progress.page === 'learn' &&
                        l.id === progress.lesson &&
                        progress.tab === 'lesson',
                      complete: progress.completed.includes(l.id),
                    }"
                    @click="emit('navigate', l.id)"
                  >
                    <span class="tree-dot"
                      ><Check v-if="progress.completed.includes(l.id)" :size="9" /></span
                    >{{ l.title }}</button
                  ><button
                    :class="{
                      selected:
                        currentChapterId === c.id &&
                        progress.page === 'learn' &&
                        progress.tab === 'quiz',
                    }"
                    @click="emit('section', c, 'quiz')"
                  >
                    <span class="tree-dot" :class="{ 'completed-mark': isChapterUnlocked(c) }"
                      ><Check v-if="isChapterUnlocked(c)" :size="10" /></span
                    >章节挑战<span class="tiny-tag">{{ c.questions.length }}</span></button
                  ><button
                    :class="{
                      selected:
                        currentChapterId === c.id &&
                        progress.page === 'learn' &&
                        progress.tab === 'project',
                    }"
                    @click="emit('section', c, 'project')"
                  >
                    <span
                      class="tree-dot"
                      :class="{ 'completed-mark': progress.passed.includes(c.id + '-project') }"
                      ><Check v-if="progress.passed.includes(c.id + '-project')" :size="10" /></span
                    ><span>专项实操</span
                    ><LockKeyhole
                      v-if="!isChapterUnlocked(c)"
                      :size="11"
                      class="ml-auto"
                    /><Sparkles v-else :size="11" class="accent ml-auto" />
                  </button>
                </div>
              </div></div
          ></Transition>
        </div>
      </nav>
    </div>
    <div class="sidebar-bottom">
      <div class="journey-card">
        <div>
          <span>每一步，都算数。</span><span class="accent">{{ percentage }}%</span>
        </div>
        <div class="progress-track"><div :style="{ width: `${percentage}%` }" /></div>
        <p>{{ completedSteps }} / {{ totalSteps }} 个学习里程碑</p>
      </div>
    </div>
    <div
      v-if="sidebarThumb.visible"
      ref="sidebarTrack"
      class="sidebar-scroll-track"
      aria-hidden="true"
      @pointerdown="dragSidebar"
    >
      <div :style="{ top: sidebarThumb.top + '%', height: sidebarThumb.height + '%' }" />
    </div>
  </aside>
</template>
