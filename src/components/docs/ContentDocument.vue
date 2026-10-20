<script setup lang="ts">
import { useCourseDocument } from '../../composables/useCourseDocument';

const props = defineProps<{ path: string }>();
const document = useCourseDocument(() => props.path);
</script>

<template>
  <component :is="document" v-if="document" class="markdown-document" />
  <p v-else role="alert">教程暂时无法加载：{{ path }}</p>
</template>
