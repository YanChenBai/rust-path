<script setup lang="ts">
import { computed } from 'vue';

import { progress } from '../progress';
import { lessonPath } from '../runtime/course-routes';

const resumePath = computed(() => lessonPath(progress.lesson));
</script>

<template>
  <section class="not-found-page" aria-labelledby="not-found-title">
    <div class="not-found-code" aria-hidden="true">404</div>
    <span class="not-found-rule" aria-hidden="true" />
    <h1 id="not-found-title">这条路，暂时走不到。</h1>
    <p>这个地址没有对应的课程。<br />换一条路径，继续你的 Rust 旅程。</p>
    <div class="not-found-actions">
      <RouterLink :to="resumePath" class="not-found-primary">返回学习空间</RouterLink>
      <RouterLink to="/path" class="not-found-secondary">查看学习路线</RouterLink>
    </div>
    <span class="not-found-caption">每一次探索，都算数。</span>
  </section>
</template>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100svh - 220px);
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
.not-found-rule {
  width: 28px;
  height: 1px;
  margin: 32px 0 26px;
  background: #68686c;
}
.not-found-page h1 {
  color: #e4e4e8;
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.5;
}
.not-found-page p {
  margin-top: 16px;
  color: #929298;
  font-size: 14px;
  line-height: 1.9;
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
.not-found-caption {
  margin-top: 56px;
  color: #616169;
  font-size: 11px;
  letter-spacing: 0.08em;
}
@media (max-width: 560px) {
  .not-found-page {
    min-height: calc(100svh - 160px);
    padding: 44px 12px;
  }
}
</style>
