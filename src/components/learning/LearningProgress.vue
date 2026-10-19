<script setup lang="ts">
import {
  ChartNoAxesCombined,
  Download,
  Compass,
  Zap,
  Flame,
  Trophy,
  Check,
  ArrowUpRight,
  HardDrive,
  Upload,
} from 'lucide-vue-next';
import { motion } from 'motion-v';
import { ref } from 'vue';

import { useLearningStats } from '../../composables/useLearningStats';
import {
  progress,
  xp,
  percentage,
  level,
  streak,
  completedSteps,
  totalSteps,
  exportProgress,
} from '../../progress';
import { chapters, allLessons } from '../../runtime/course';
const { achievements, lessonCount, questionCount, chapterPercent } = useLearningStats();
const importInput = ref<HTMLInputElement>();
const emit = defineEmits<{ navigate: [id: string]; import: [event: Event] }>();
const navigate = (id: string) => emit('navigate', id);
</script>
<template>
  <motion.div :initial="{ opacity: 0 }" :animate="{ opacity: 1 }"
    ><div class="overview-eyebrow"><ChartNoAxesCombined :size="16" />YOUR JOURNEY, SO FAR</div>
    <div class="progress-title">
      <div>
        <h1>那些小小的进步，都在这里。</h1>
        <p class="page-subtitle">不和别人比较。今天的你，又比昨天多懂了一点。</p>
      </div>
      <button class="secondary-button" @click="exportProgress">
        <Download :size="15" />导出记录
      </button>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <span><Compass :size="17" />整体进度</span><strong>{{ percentage }}<small>%</small></strong>
        <p>{{ completedSteps }} / {{ totalSteps }} 个里程碑</p>
        <div class="progress-track"><div :style="{ width: `${percentage}%` }" /></div>
      </div>
      <div class="stat-card">
        <span><Zap :size="17" />成长经验</span><strong>{{ xp }}<small>XP</small></strong>
        <p>Lv.{{ level }} · 距下一级 {{ 200 - (xp % 200) }} XP</p>
      </div>
      <div class="stat-card">
        <span><Flame :size="17" />连续学习</span><strong>{{ streak }}<small>天</small></strong>
        <p>每一次动手，都会留下记录</p>
      </div>
      <div class="stat-card">
        <span><Trophy :size="17" />实战项目</span
        ><strong
          >{{ progress.passed.filter(id => id.endsWith('-project')).length
          }}<small>/ {{ chapters.length }}</small></strong
        >
        <p>把学到的知识变成作品</p>
      </div>
    </div>
    <section class="progress-section">
      <h2>
        你的章节地图<span
          >{{ allLessons.length }} 个知识点 ·
          {{ chapters.reduce((total, c) => total + c.questions.length, 0) }} 道挑战 ·
          {{ chapters.length }} 个项目</span
        >
      </h2>
      <div v-for="c in chapters" :key="c.id" class="chapter-progress-row">
        <span class="path-number" :class="{ 'completed-mark': chapterPercent(c.id) === 100 }"
          ><Check v-if="chapterPercent(c.id) === 100" :size="15" /><template v-else>{{
            c.icon
          }}</template></span
        >
        <div>
          <strong>{{ c.title }}</strong>
          <p>
            {{ lessonCount(c.id) }} / {{ c.lessons.length }} 知识点 · {{ questionCount(c.id) }} /
            {{ c.questions.length }} 挑战
          </p>
        </div>
        <div class="progress-track">
          <div :style="{ width: `${chapterPercent(c.id)}%` }" />
        </div>
        <span>{{ chapterPercent(c.id) }}%</span
        ><button
          class="icon-button"
          :aria-label="`学习${c.title}`"
          @click="navigate(c.lessons[0]!.id)"
        >
          <ArrowUpRight :size="17" />
        </button>
      </div>
    </section>
    <section class="progress-section">
      <h2>成长勋章<span>属于每一份小小的坚持</span></h2>
      <div class="achievement-grid">
        <div
          v-for="badge in achievements"
          :key="badge.title"
          class="achievement"
          :class="{ earned: badge.earned }"
        >
          <span><component :is="badge.icon" :size="26" /></span><strong>{{ badge.title }}</strong>
          <p>{{ badge.subtitle }}</p>
          <small>{{ badge.earned ? '已点亮' : '等待点亮' }}</small>
        </div>
      </div>
    </section>
    <div class="backup-card">
      <HardDrive :size="23" />
      <div>
        <strong>学习记录，由你保管。</strong>
        <p>所有数据仅保存在当前浏览器。清除站点数据会删除记录，可导出备份或在另一浏览器导入。</p>
      </div>
      <button class="secondary-button" @click="importInput?.click()">
        <Upload :size="14" />导入记录</button
      ><input
        ref="importInput"
        type="file"
        accept="application/json"
        hidden
        @change="emit('import', $event)"
      /></div
  ></motion.div>
</template>
