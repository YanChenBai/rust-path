<script setup lang="ts">
import { ref, watch } from 'vue';

import { highlightCode } from '../runtime/highlight';
import { syntaxSegments } from '../runtime/syntax-text';

const props = defineProps<{ text: string; code?: boolean }>();
const parts = ref<{ text: string; code: boolean; html?: string }[]>([]);
let generation = 0;

watch(
  () => [props.text, props.code] as const,
  async ([text, code]) => {
    const current = ++generation;

    const segments = syntaxSegments(text, code);

    parts.value = segments;

    const highlighted = await Promise.all(
      segments.map(async segment => {
        if (!segment.code) {
          return segment;
        }

        try {
          const html = (await highlightCode(segment.text))
            .replace(/^<pre[^>]*><code>/, '')
            .replace(/<\/code><\/pre>$/, '');

          return { ...segment, html };
        } catch {
          return segment;
        }
      }),
    );

    if (current === generation) {
      parts.value = highlighted;
    }
  },
  { immediate: true },
);
</script>

<template>
  <span class="syntax-text"
    ><template v-for="(part, index) in parts" :key="index"
      ><code v-if="part.code && part.html" v-html="part.html" /><code v-else-if="part.code">{{
        part.text
      }}</code
      ><template v-else>{{ part.text }}</template></template
    ></span
  >
</template>
