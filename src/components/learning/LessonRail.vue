<script setup lang="ts">
import { BookOpen, ArrowUpRight, Check, LockKeyhole, Flame, Zap, Flag } from 'lucide-vue-next';
import { computed } from 'vue';

import { useCurrentLesson } from '../../composables/useCurrentLesson';
import { useLearningStats } from '../../composables/useLearningStats';
import { progress, xp, level, streak } from '../../progress';
const { chapter, lesson, projectUnlocked } = useCurrentLesson();

const { week } = useLearningStats();

const section = computed({
  get: () => progress.tab,
  set: value => {
    progress.tab = value;
  },
});

const emit = defineEmits<{ navigate: [id: string] }>();
const navigate = (id: string) => emit('navigate', id);
</script>
<template>
  <aside class="right-rail">
    <div class="rail-section">
      <div class="rail-heading">
        <span>你的成长</span><span class="level-tag">Lv.{{ level }}</span>
      </div>
      <div class="xp-counter">
        <Zap :size="20" fill="currentColor" /><strong>{{ xp }}</strong
        ><span>XP</span>
      </div>
      <div class="progress-track"><div :style="{ width: `${(xp % 200) / 2}%` }" /></div>
      <p class="rail-muted">再积累 {{ 200 - (xp % 200) }} XP，遇见更好的自己</p>
    </div>
    <div class="rail-section">
      <div class="rail-heading"><span>把学习变成习惯</span><Flame :size="16" class="accent" /></div>
      <div class="week-days">
        <div v-for="(day, i) in week" :key="i" :class="{ today: day.today, active: day.active }">
          <span>{{ day.day }}</span
          ><i><Check v-if="day.active" :size="13" /><span v-else /></i>
        </div>
      </div>
      <p class="rail-muted">
        {{ streak ? `已经连续学习 ${streak} 天，保持这个节奏。` : '今天，是开启好习惯的好日子。' }}
      </p>
    </div>
    <div class="rail-section chapter-outline">
      <div class="rail-heading">
        <span>本章地图</span><span class="rail-muted">{{ chapter.lessons.length + 2 }} 站</span>
      </div>
      <button
        v-for="(l, i) in chapter.lessons"
        :key="l.id"
        :class="{ current: l.id === lesson.id && section === 'lesson' }"
        @click="navigate(l.id)"
      >
        <span class="outline-number"
          ><Check v-if="progress.completed.includes(l.id)" :size="11" /><template v-else>{{
            i + 1
          }}</template></span
        >
        <div>
          {{ l.title }}<small>{{ l.minutes }} 分钟</small>
        </div>
        <span v-if="l.id === lesson.id && section === 'lesson'" class="you-are-here"
          >正在学</span
        ></button
      ><button :class="{ current: section === 'quiz' }" @click="section = 'quiz'">
        <span class="outline-number"><Zap :size="12" /></span>
        <div>章节挑战<small>选择 · 填空 · 编程</small></div></button
      ><button :class="{ current: section === 'project' }" @click="section = 'project'">
        <span class="outline-number"
          ><LockKeyhole v-if="!projectUnlocked" :size="11" /><Flag v-else :size="11"
        /></span>
        <div>
          专项实操<small>{{ projectUnlocked ? '已解锁，开始创造' : '通过挑战后解锁' }}</small>
        </div>
      </button>
    </div>
    <div class="growth-note">
      <span class="note-star">✳</span>
      <h3>不用一次就写对。</h3>
      <p>编译器的每一次提醒，<br />都是理解 Rust 的一次机会。<br />大胆尝试，慢慢来。</p>
      <div class="note-line" />
      <span>GROW AT YOUR OWN PACE</span>
    </div>
    <a
      class="rail-reference"
      :href="`https://doc.rust-lang.org/book/${chapter.source}`"
      target="_blank"
      rel="noopener noreferrer"
      ><BookOpen :size="16" />
      <div>站在可靠知识的肩上<small>Rust 官方文档</small></div>
      <ArrowUpRight :size="14"
    /></a>
  </aside>
</template>
