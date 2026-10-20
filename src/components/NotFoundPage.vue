<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { computed, onMounted, ref } from 'vue';

import { progress, restoreProgress } from '../progress';
import { lessonPath } from '../runtime/course-routes';

const isRestored = ref(false);
const resumePath = computed(() => lessonPath(isRestored.value ? progress.lesson : 'hello'));

onMounted(() => {
  restoreProgress();
  isRestored.value = true;
});

useHead({
  title: '页面不存在 · Rust Path',
  meta: [{ name: 'robots', content: 'noindex' }],
});
</script>

<template>
  <main id="main-content" class="not-found-page" aria-label="页面不存在">
    <h1 class="not-found-code">404</h1>
    <div class="not-found-actions">
      <RouterLink :to="resumePath" class="not-found-primary">返回学习空间</RouterLink>
      <RouterLink to="/path" class="not-found-secondary">查看学习路线</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100svh;
  padding: 64px 20px;
  text-align: center;
}
.not-found-code {
  color: #444448;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: clamp(88px, 14vw, 140px);
  font-weight: 400;
  letter-spacing: -0.08em;
  line-height: 1;
  user-select: none;
}
.not-found-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}
.not-found-actions a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 500;
}
.not-found-primary {
  background: #e7e7e7;
  color: #191919;
}
.not-found-primary:hover {
  background: #fff;
}
.not-found-actions .not-found-secondary {
  border-color: #363638;
  color: #b0b0b6;
}
.not-found-secondary:hover {
  background: #202022;
  color: #eee;
}
@media (max-width: 560px) {
  .not-found-page {
    padding: 44px 12px;
  }
}
</style>
