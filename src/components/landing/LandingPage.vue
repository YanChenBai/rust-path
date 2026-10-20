<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { ArrowRight } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

import { progress, restoreProgress } from '../../progress';
import { workspacePath } from '../../runtime/course-routes';
import LandingBackground from './LandingBackground.vue';

const isRestored = ref(false);

const learningPath = computed(() =>
  isRestored.value ? workspacePath({ ...progress, page: 'learn' }) : '/learn/hello',
);

onMounted(() => {
  restoreProgress();
  isRestored.value = true;
});

useHead({
  title: 'Rust Path · Rust 交互式教程',
  meta: [
    {
      name: 'description',
      content:
        '由 GPT-6.1 Sol 参考 Rust 教程与官方文档生成的交互式教程，在浏览器中阅读、运行代码和完成练习',
    },
  ],
});
</script>

<template>
  <div class="landing-page">
    <LandingBackground />
    <header class="landing-header">
      <RouterLink to="/" class="landing-brand" aria-label="Rust Path 首页">Rust Path</RouterLink>
      <RouterLink to="/path" class="landing-route">学习路线<ArrowRight :size="17" /></RouterLink>
    </header>
    <main id="main-content" class="landing-main">
      <div class="landing-intro">
        <h1><span class="landing-rust">Rust</span><span>交互式教程</span></h1>
        <p class="landing-description">在浏览器中阅读、运行代码和完成练习</p>
        <RouterLink :to="learningPath" class="landing-start">
          开始学习<ArrowRight :size="20" />
        </RouterLink>
      </div>
      <p class="landing-attribution">
        <span>由 <strong>GPT-6.1 Sol</strong> 生成</span>
        <span>参考 Rust 教程与官方文档</span>
      </p>
    </main>
  </div>
</template>

<style scoped>
.landing-page {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  height: 100svh;
  min-height: 480px;
  overflow: hidden;
  background: #101010;
  color: #e7e7e7;
  --landing-gutter: clamp(28px, 5.5vw, 88px);
}
.landing-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  max-width: 1920px;
  margin-inline: auto;
  padding: 32px var(--landing-gutter);
}
.landing-brand {
  font-size: 20px;
  font-weight: 650;
  letter-spacing: -0.7px;
}
.landing-route {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #aaa;
  font-size: 14px;
}
.landing-route:hover {
  color: #fff;
}
.landing-main {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-height: 0;
  width: 100%;
  max-width: 1920px;
  margin-inline: auto;
  padding: 0 var(--landing-gutter) 52px;
}
.landing-intro {
  margin-top: -20px;
}
.landing-intro h1 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  font-size: clamp(42px, 5vw, 76px);
  font-weight: 550;
  line-height: 1.18;
  letter-spacing: -0.045em;
}
.landing-intro .landing-rust {
  font-size: clamp(84px, 9vw, 136px);
  font-weight: 650;
  line-height: 1;
  letter-spacing: -0.065em;
}
.landing-description {
  margin-top: 32px;
  font-size: 16px;
  line-height: 1.8;
  color: #969696;
}
.landing-start {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 36px;
  min-height: 50px;
  margin-top: 36px;
  padding: 0 23px;
  border: 1px solid #e7e7e7;
  border-radius: 6px;
  background: #e7e7e7;
  color: #171717;
  font-size: 15px;
  font-weight: 550;
}
.landing-start:hover {
  background: #fff;
  border-color: #fff;
}
.landing-start svg {
  transition: transform 180ms ease;
}
.landing-start:hover svg {
  transform: translateX(3px);
}
.landing-attribution {
  position: absolute;
  bottom: 44px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: #777;
  font-size: 12px;
  line-height: 1.6;
}
.landing-attribution strong {
  color: #aaa;
  font-weight: 450;
}
@media (max-width: 640px) {
  .landing-page {
    min-height: 440px;
  }
  .landing-header {
    padding-top: max(24px, env(safe-area-inset-top));
    padding-bottom: 24px;
  }
  .landing-brand {
    font-size: 18px;
  }
  .landing-route {
    gap: 8px;
    font-size: 13px;
  }
  .landing-main {
    justify-content: flex-start;
    padding-top: clamp(50px, 12svh, 120px);
  }
  .landing-intro {
    margin-top: 0;
  }
  .landing-intro h1 {
    gap: 12px;
    font-size: clamp(36px, 10vw, 52px);
  }
  .landing-intro .landing-rust {
    font-size: clamp(76px, 22vw, 108px);
  }
  .landing-description {
    max-width: 280px;
    margin-top: 24px;
    font-size: 14px;
  }
  .landing-start {
    margin-top: 28px;
  }
  .landing-attribution {
    bottom: max(28px, env(safe-area-inset-bottom));
  }
}
@media (max-height: 650px) {
  .landing-main {
    justify-content: flex-start;
    padding-top: 16px;
  }
  .landing-intro {
    margin-top: 0;
  }
  .landing-intro .landing-rust {
    font-size: 72px;
  }
  .landing-intro h1 {
    font-size: 38px;
    gap: 8px;
  }
  .landing-description {
    margin-top: 18px;
  }
  .landing-start {
    margin-top: 22px;
  }
  .landing-attribution {
    bottom: 24px;
  }
}
@media (max-height: 480px) and (min-width: 480px) {
  .landing-page {
    min-height: 320px;
  }
  .landing-header {
    padding-top: 18px;
    padding-bottom: 18px;
  }
  .landing-main {
    padding-top: 8px;
  }
  .landing-intro h1 {
    flex-direction: row;
    align-items: baseline;
    gap: 24px;
    font-size: 40px;
  }
  .landing-intro .landing-rust {
    font-size: 64px;
  }
  .landing-description {
    margin-top: 12px;
  }
  .landing-start {
    margin-top: 16px;
    min-height: 44px;
  }
  .landing-attribution {
    right: var(--landing-gutter);
    font-size: 11px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .landing-start svg {
    transition: none;
  }
}
</style>
