<script setup lang="ts">
import {
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  Check,
  Flame,
  Menu,
  X,
  Search,
  HardDrive,
} from 'lucide-vue-next';

import CodeEditor from './components/CodeEditor.vue';
import CourseDialogs from './components/layout/CourseDialogs.vue';
import CourseSidebar from './components/layout/CourseSidebar.vue';
import NativeServiceSettings from './components/layout/NativeServiceSettings.vue';
import ResourceLoading from './components/layout/ResourceLoading.vue';
import LearningPath from './components/learning/LearningPath.vue';
import LearningProgress from './components/learning/LearningProgress.vue';
import LessonPage from './components/learning/LessonPage.vue';
import LessonRail from './components/learning/LessonRail.vue';
import { useLearningWorkspace } from './composables/useLearningWorkspace';
import { progress, streak, storage, exportProgress } from './progress';
import { nativeServiceUrl } from './runtime/native';
const workspace = useLearningWorkspace();

const {
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
} = workspace;
</script>
<template>
  <div
    class="app-shell"
    :class="{
      'playground-mode': progress.page === 'playground',
      'focus-mode': progress.focusMode,
    }"
  >
    <Transition name="nav-scrim">
      <button v-if="sidebar" class="sidebar-scrim" aria-label="关闭导航" @click="sidebar = false" />
    </Transition>
    <CourseSidebar
      :open="sidebar"
      :current-chapter-id="chapter.id"
      @navigate="navigate"
      @page="page"
      @help="showHelp = true"
      @section="openChapterSection"
    />
    <div class="main-shell">
      <header v-if="progress.page !== 'playground'" class="topbar">
        <div class="topbar-leading">
          <button
            class="icon-button focus-button"
            :aria-label="progress.focusMode ? '展开侧栏' : '收起侧栏'"
            :aria-pressed="progress.focusMode"
            :title="progress.focusMode ? '展开侧栏' : '收起侧栏'"
            @click="progress.focusMode = !progress.focusMode"
          >
            <PanelLeftOpen v-if="progress.focusMode" :size="17" />
            <PanelLeftClose v-else :size="17" />
          </button>
          <div class="breadcrumbs">
            <button
              class="mobile-menu icon-button"
              aria-label="打开课程导航"
              @click="sidebar = !sidebar"
            >
              <Menu :size="20" /></button
            ><span class="desktop-breadcrumb">学习空间</span><ChevronRight :size="13" /><span
              v-if="progress.page === 'learn'"
              >{{ chapter.title }}</span
            ><span v-else>{{
              { path: '学习路线', playground: '代码实验室', progress: '学习足迹' }[progress.page]
            }}</span
            ><template v-if="progress.page === 'learn'"
              ><ChevronRight :size="13" /><strong>{{
                section === 'lesson' ? lesson.title : section === 'quiz' ? '章节挑战' : '专项实操'
              }}</strong></template
            >
          </div>
        </div>
        <div class="topbar-right">
          <ResourceLoading />
          <NativeServiceSettings />
          <button
            class="icon-button"
            aria-label="搜索知识点"
            title="搜索知识点"
            @click="showSearch = true"
          >
            <Search :size="17" />
          </button>
          <span class="saved-state" :title="storage.error || '学习记录保存在当前浏览器中'"
            ><HardDrive :size="13" /><span>{{ storage.error ? '保存异常' : '已本地保存' }}</span
            ><i :class="{ error: storage.error }" /></span
          ><span class="topbar-divider" /><span class="streak-badge"
            ><Flame :size="16" />{{ streak }}<span>天</span></span
          ><button class="mini-avatar" title="查看学习足迹" @click="page('progress')">R</button>
        </div>
      </header>
      <div v-if="storage.error" class="storage-warning" role="alert">
        {{ storage.error }}<button @click="exportProgress">导出备份</button>
      </div>
      <div class="content-layout" :class="{ 'full-width': progress.page !== 'learn' }">
        <main id="main-content" :key="nativeServiceUrl" class="main-content">
          <LessonPage
            v-if="progress.page === 'learn'"
            @navigate="navigate"
            @finish="finish"
            @reward="notify"
          />
          <LearningPath
            v-else-if="progress.page === 'path'"
            @navigate="navigate"
            @resume="page('learn')"
          />
          <div v-else-if="progress.page === 'playground'" class="playground-workspace">
            <CodeEditor
              editor-id="playground"
              @search="showSearch = true"
              @navigation="sidebar = !sidebar"
              :initial-code="playgroundCode"
              :dependencies="progress.dependencies"
            />
          </div>
          <LearningProgress v-else @navigate="navigate" @import="onImport" />
          <footer class="page-footer">
            <span><span class="footer-mark">r.</span> 用实践，让知识生根。</span
            ><span>Made for the curious. <span class="footer-spark">✳</span></span>
          </footer>
        </main>
        <LessonRail v-if="progress.page === 'learn'" @navigate="navigate" />
      </div>
    </div>
    <Transition name="toast"
      ><div v-if="notice" class="toast-message" role="status">
        <span><Check :size="16" /></span>{{ notice
        }}<button class="icon-button" aria-label="关闭提示" @click="notice = ''">
          <X :size="13" />
        </button></div
    ></Transition>
    <CourseDialogs
      v-model:search-open="showSearch"
      v-model:help-open="showHelp"
      @navigate="navigate"
    />
  </div>
</template>
