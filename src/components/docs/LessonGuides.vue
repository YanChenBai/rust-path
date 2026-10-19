<script setup lang="ts">
import { lessonGuides } from '../../data/explanations';
import ContentDocument from './ContentDocument.vue';
defineProps<{ lessonId: string }>();
</script>
<template>
  <section class="lesson-reading">
    <ContentDocument
      v-for="guide in lessonGuides[lessonId]"
      :key="guide.document"
      :path="guide.document"
    />
    <p class="guide-source">
      讲解参考
      <a href="https://doc.rust-lang.org/book/" target="_blank" rel="noopener noreferrer"
        >Rust 官方文档</a
      >，中文组织参考
      <a href="https://rustwiki.org/zh-CN/book/" target="_blank" rel="noopener noreferrer"
        >中文译本</a
      >。语法以当前课程工具链为准。
    </p>
  </section>
</template>
