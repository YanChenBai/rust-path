<script setup lang="ts">
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Check,
  LockKeyhole,
  Zap,
  ExternalLink,
  Flag,
  Clock3,
} from 'lucide-vue-next';
import { motion, useReducedMotion } from 'motion-v';
import { computed, ref } from 'vue';

import { useCurrentLesson } from '../../composables/useCurrentLesson';
import { progress } from '../../progress';
import { chapters, allLessons } from '../../runtime/course';
import ChapterQuiz from '../ChapterQuiz.vue';
import ContentDocument from '../docs/ContentDocument.vue';
import StudyNotes from './StudyNotes.vue';

const { chapter, lesson, chapterIndex, lessonIndex, localIndex, projectUnlocked, lessonDone } =
  useCurrentLesson();

const reducedMotion = useReducedMotion();
const reading = ref<HTMLElement>();

const section = computed({
  get: () => progress.tab,
  set: value => {
    progress.tab = value;
  },
});

const emit = defineEmits<{ navigate: [id: string]; finish: []; reward: [message: string] }>();
const navigate = (id: string) => emit('navigate', id);
const notify = (message: string) => emit('reward', message);
</script>
<template>
  <motion.div
    :key="`${lesson.id}-${section}`"
    :initial="{ opacity: 0, y: reducedMotion ? 0 : 10 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.25 }"
  >
    <div class="lesson-eyebrow">
      <span class="chapter-pill">CHAPTER {{ chapter.icon }}</span
      ><span class="eyebrow-dot" />{{
        section === 'lesson'
          ? `第 ${localIndex + 1} / ${chapter.lessons.length} 节`
          : section === 'quiz'
            ? '检验你的理解'
            : '从知识到作品'
      }}<span class="lesson-time"
        ><Clock3 :size="13" />{{
          section === 'lesson' ? lesson.minutes : section === 'quiz' ? 15 : 30
        }}
        分钟</span
      >
    </div>
    <div class="lesson-title-row">
      <div>
        <h1>
          {{
            section === 'lesson'
              ? lesson.title
              : section === 'quiz'
                ? '把理解，变成你的能力。'
                : '是时候，造点东西了。'
          }}
        </h1>
        <p class="page-subtitle">
          {{
            section === 'lesson'
              ? lesson.subtitle
              : section === 'quiz'
                ? '不急着看答案。给自己一点思考的时间。'
                : '一个真实的小项目，连接所有学过的知识。'
          }}
        </p>
      </div>
      <span class="lesson-symbol">{{
        section === 'lesson' ? '{ }' : section === 'quiz' ? '?_' : '↗'
      }}</span>
    </div>
    <div class="lesson-stage">
      <button :class="{ active: section === 'lesson' }" @click="section = 'lesson'">
        <BookOpen :size="14" />理解知识<span v-if="lessonDone" class="stage-check"
          ><Check :size="11"
        /></span></button
      ><ChevronRight :size="12" /><button
        :class="{ active: section === 'quiz' }"
        @click="section = 'quiz'"
      >
        <Zap :size="14" />动手挑战</button
      ><ChevronRight :size="12" /><button
        :class="{ active: section === 'project' }"
        @click="section = 'project'"
      >
        <LockKeyhole v-if="!projectUnlocked" :size="13" /><Flag v-else :size="13" />专项实操
      </button>
    </div>
    <template v-if="section === 'lesson'">
      <div ref="reading" class="annotated-reading">
        <ContentDocument :key="lesson.id" :path="lesson.document!" />
      </div>
      <div class="lesson-bottom">
        <div>
          <span class="mini-check"><Check :size="14" /></span>
          <div>
            <strong>{{
              lessonDone ? '这个知识点，已收入囊中。' : '理解了？让这一步留下足迹。'
            }}</strong>
            <p>
              {{
                lessonDone ? '随时回来练习，温故也会有新收获。' : '运行示例后完成学习，获得 20 XP。'
              }}
            </p>
          </div>
        </div>
        <button class="primary-button" @click="emit('finish')">
          {{ localIndex === chapter.lessons.length - 1 ? '完成并开始挑战' : '完成，继续下一节'
          }}<ArrowRight :size="16" />
        </button>
      </div>
      <div class="lesson-navigation">
        <button :disabled="lessonIndex === 0" @click="navigate(allLessons[lessonIndex - 1]!.id)">
          <ChevronLeft :size="14" />上一知识点</button
        ><a
          :href="
            chapter.source.startsWith('https://')
              ? chapter.source
              : `https://doc.rust-lang.org/book/${chapter.source}`
          "
          target="_blank"
          rel="noopener noreferrer"
          >延伸阅读 · Rust 官方文档<ExternalLink :size="12" /></a
        ><button
          v-if="lessonIndex < allLessons.length - 1"
          @click="navigate(allLessons[lessonIndex + 1]!.id)"
        >
          下一知识点<ChevronRight :size="14" />
        </button>
      </div>
    </template>
    <template v-else
      ><ChapterQuiz
        :key="`${chapter.id}-${section}`"
        :chapter="chapter"
        :project="section === 'project'"
        @reward="notify" />
      <div class="quiz-navigation">
        <button class="secondary-button" @click="section = 'lesson'">
          <ChevronLeft :size="14" />回顾知识</button
        ><button
          v-if="section === 'quiz' && projectUnlocked"
          class="primary-button"
          @click="section = 'project'"
        >
          开始专项实操<ArrowRight :size="15" /></button
        ><button
          v-if="
            section === 'project' &&
            progress.passed.includes(`${chapter.id}-project`) &&
            chapterIndex < chapters.length - 1
          "
          class="primary-button"
          @click="navigate(chapters[chapterIndex + 1]!.lessons[0]!.id)"
        >
          进入下一章<ArrowRight :size="15" />
        </button></div
    ></template>
  </motion.div>
  <StudyNotes
    :chapter="chapter"
    :lesson-id="lesson.id"
    :content="section === 'lesson' ? reading : undefined"
    @navigate="navigate"
  />
</template>
