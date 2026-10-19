<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import { ref, watch } from 'vue';

import { highlightCode } from '../../runtime/highlight';

const props = defineProps<{ text: string }>();
// 用户笔记只渲染 Markdown，不执行 HTML 或 Vue 模板。
const markdown = new MarkdownIt({ html: false, linkify: true });
const html = ref('');
let generation = 0;

watch(
  () => props.text,
  async text => {
    const current = ++generation;
    html.value = markdown.render(text);
    const tokens = markdown.parse(text, {});
    const fences = tokens.filter(token => token.type === 'fence');

    const highlighted = await Promise.allSettled(
      fences.map(async token => {
        const language = token.info.trim().split(/\s+/)[0] || 'rust';
        const normalized = ['sh', 'shell'].includes(language) ? 'bash' : language;

        if (!['rust', 'toml', 'bash'].includes(normalized)) {
          return;
        }

        return { token, content: await highlightCode(token.content, normalized) };
      }),
    );

    if (current !== generation) {
      return;
    }

    for (const result of highlighted) {
      if (result.status === 'fulfilled' && result.value) {
        result.value.token.type = 'html_block';
        result.value.token.content = result.value.content;
      }
    }

    html.value = markdown.renderer.render(tokens, markdown.options, {});
  },
  { immediate: true },
);
</script>
<template><div class="markdown-note" v-html="html" /></template>
