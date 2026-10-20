<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

import LandingPage from './components/landing/LandingPage.vue';
import NotFoundPage from './components/NotFoundPage.vue';

const WorkspaceApp = defineAsyncComponent(() => import('./WorkspaceApp.vue'));
const route = useRoute();
const isLanding = computed(() => Boolean(route.meta.landing));
const isNotFound = computed(() => Boolean(route.meta.notFound));
</script>

<template>
  <Transition name="entry-page" mode="out-in">
    <NotFoundPage v-if="isNotFound" />
    <LandingPage v-else-if="isLanding" />
    <WorkspaceApp v-else />
  </Transition>
</template>

<style>
.entry-page-enter-active,
.entry-page-leave-active {
  transition: opacity 180ms ease;
}
.entry-page-enter-from,
.entry-page-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .entry-page-enter-active,
  .entry-page-leave-active {
    transition: none;
  }
}
</style>
