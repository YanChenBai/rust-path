<script setup lang="ts">
import { Lightbulb } from 'lucide-vue-next';
withDefaults(defineProps<{ title?: string }>(), { title: '记住这个小细节' });
</script>
<template>
  <aside class="concept-note markdown-callout">
    <Lightbulb :size="17" />
    <div>
      <strong>{{ title }}</strong
      ><slot />
    </div>
  </aside>
</template>
