<script setup lang="ts">
import { ArrowUpRight, ArrowRight, Check, Compass, GraduationCap } from 'lucide-vue-next';
import { motion } from 'motion-v';

import {
  progress,
  chapterCompletion as chapterPercent,
  percentage,
  completedSteps,
  totalSteps,
} from '../../progress';
import { chapters, allLessons, sources } from '../../runtime/course';
const emit = defineEmits<{ navigate: [id: string]; resume: [] }>();
const navigate = (id: string) => emit('navigate', id);
const page = () => emit('resume');
</script>
<template>
  <motion.div :initial="{ opacity: 0 }" :animate="{ opacity: 1 }"
    ><div class="overview-eyebrow"><Compass :size="16" />THE LEARNING PATH</div>
    <h1>每一小步，走向更大的可能。</h1>
    <p class="page-subtitle">
      {{ chapters.length }} 个阶段，{{ allLessons.length }}
      个知识点。从第一行代码，到独立完成一个作品。
    </p>
    <div class="path-intro">
      <div>
        <span class="eyebrow">你的 RUST 学习主线</span>
        <h2>边学，边写，边成长。</h2>
        <p>理解一个概念，运行一次实验，通过一个挑战。<br />无需追赶进度，找到自己的节奏就好。</p>
        <button class="primary-button" @click="page()">
          {{ progress.completed.length ? '继续我的旅程' : '开始我的旅程' }}<ArrowRight :size="16" />
        </button>
        <div class="global-learning-progress">
          <span class="global-progress-label"
            >每一步，都算数。<strong>{{ percentage }}%</strong></span
          >
          <div
            class="global-progress-track"
            role="progressbar"
            aria-label="整体学习进度"
            :aria-valuenow="percentage"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <span :style="{ width: `${percentage}%` }" />
          </div>
          <span class="global-progress-count"
            >{{ completedSteps }} / {{ totalSteps }} 个学习里程碑</span
          >
        </div>
      </div>
      <div class="path-art">
        <span class="orbit orbit-one" /><span class="orbit orbit-two" /><span class="art-code"
          >{ R }</span
        ><span class="art-label">learn by doing.</span>
      </div>
    </div>
    <div class="path-grid">
      <button
        v-for="(c, i) in chapters"
        :key="c.id"
        class="path-card"
        :class="{ 'chapter-completed': chapterPercent(c.id) === 100 }"
        @click="navigate(c.lessons[0]!.id)"
      >
        <div class="path-card-top">
          <span class="path-number">{{ c.icon }}</span
          ><span v-if="chapterPercent(c.id) === 100" class="success-text"
            ><Check :size="14" />已完成</span
          ><span v-else class="muted">{{
            chapterPercent(c.id)
              ? `${chapterPercent(c.id)}% 已完成`
              : i === 0
                ? '从这里开始'
                : '等待探索'
          }}</span>
        </div>
        <h2>{{ c.title }}<ArrowUpRight :size="19" /></h2>
        <p>{{ c.description }}</p>
        <div class="path-tags">
          <span>{{ c.lessons.length }} 个知识点</span><span>3 道挑战</span><span>1 个项目</span>
        </div>
        <div class="progress-track">
          <div :style="{ width: `${chapterPercent(c.id)}%` }" />
        </div>
      </button>
    </div>
    <div class="source-section">
      <span class="eyebrow">STAND ON THE SHOULDERS OF GIANTS</span>
      <h3>好的学习，从可靠的知识开始。</h3>
      <div class="source-links">
        <a
          v-for="source in sources"
          :key="source.name"
          :href="source.url"
          target="_blank"
          rel="noopener noreferrer"
          ><GraduationCap :size="19" />
          <div>
            <strong>{{ source.name }}</strong>
            <p>{{ source.label }}</p>
          </div>
          <ArrowUpRight :size="15"
        /></a>
      </div></div
  ></motion.div>
</template>
