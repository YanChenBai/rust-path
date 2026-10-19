<script setup lang="ts">
import { Copy, Check, SquarePen } from 'lucide-vue-next';
import { ref, watch } from 'vue';

import { highlightCode } from '../runtime/highlight';

const props = withDefaults(
  defineProps<{ code: string; filename?: string; language?: string; editable?: boolean }>(),
  { filename: 'main.rs', language: 'rust', editable: false },
);

const emit = defineEmits<{ edit: [] }>();
const html = ref('');
const copied = ref(false);
const copyError = ref('');
let generation = 0;
watch(
  () => props.code,
  async code => {
    const id = ++generation;

    try {
      const result = await highlightCode(code, props.language);

      if (id === generation) {
        html.value = result;
      }
    } catch {
      html.value = '';
    }
  },
  { immediate: true },
);

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    copyError.value = '复制失败，请手动选择代码。';
  }
}
</script>
<template>
  <div class="code-snippet">
    <div class="snippet-header">
      <div class="snippet-file-group">
        <button v-if="editable" class="snippet-edit" @click="emit('edit')">
          <SquarePen :size="14" />编辑运行
        </button>
        <strong class="snippet-filename">{{ filename }}</strong>
      </div>
      <div>
        <button title="复制代码" aria-label="复制代码" @click="copy">
          <Check v-if="copied" :size="14" /><Copy v-else :size="14" />{{
            copied ? '已复制' : '复制'
          }}
        </button>
      </div>
    </div>
    <div v-if="html" class="snippet-highlight" v-html="html" />
    <pre v-else class="snippet-fallback"><code>{{code}}</code></pre>
    <p v-if="copyError" class="copy-error">{{ copyError }}</p>
  </div>
</template>
