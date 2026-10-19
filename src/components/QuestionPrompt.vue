<script setup lang="ts">
import { computed } from 'vue';

import { splitPrompt } from '../runtime/question-prompt';
import CodeSnippet from './CodeSnippet.vue';
import SyntaxText from './SyntaxText.vue';

const props = defineProps<{ text: string }>();
const parts = computed(() => splitPrompt(props.text));
</script>
<template>
  <div class="question-prompt">
    <template v-for="(part, index) in parts" :key="index">
      <CodeSnippet v-if="part.kind === 'code'" :code="part.text" filename="题目代码" />
      <p v-else><SyntaxText :text="part.text" /></p>
    </template>
  </div>
</template>
