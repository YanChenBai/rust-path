<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next';
import { computed, ref, watch, nextTick } from 'vue';

import type { RunResult } from '../runtime/rust';
import { terminalHtml } from '../runtime/terminal';

const props = defineProps<{
  text: string;
  busy: boolean;
  status: string;
  error: string;
  command: string;
  result?: RunResult;
}>();

const host = ref<HTMLElement>();
const html = computed(() => terminalHtml(props.text));
watch(
  () => props.text,
  () => {
    const el = host.value;
    const follow = !el || el.scrollHeight - el.clientHeight - el.scrollTop < 70;
    void nextTick(() => {
      if (follow && host.value) {
        host.value.scrollTop = host.value.scrollHeight;
      }
    });
  },
);
</script>
<template>
  <div ref="host" class="terminal-output" aria-live="polite" aria-label="程序流式输出">
    <div v-if="text || busy || result" class="terminal-command">$ {{ command }}</div>
    <pre v-if="text" class="terminal-ansi" v-html="html" />
    <div v-if="busy" class="terminal-running">
      <LoaderCircle :size="13" class="spin" /><span>{{ text ? '执行中…' : status }}</span>
    </div>
    <pre v-if="error" class="error-text">{{ error }}</pre>
    <div v-if="!text && !busy && !error && !result" class="terminal-empty">
      <span class="prompt">❯</span>Ctrl + Enter 运行<span class="cursor" />
    </div>
  </div>
</template>
