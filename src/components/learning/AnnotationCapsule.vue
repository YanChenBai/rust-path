<script setup lang="ts">
import { MessageSquareText } from 'lucide-vue-next';
import { computed, onBeforeUnmount, ref } from 'vue';

import type { TextAnnotation } from '../../runtime/text-annotations';
import MarkdownNote from './MarkdownNote.vue';

const props = defineProps<{ annotation: TextAnnotation }>();
const emit = defineEmits<{ open: [] }>();
const visible = ref(false);
const style = ref({ left: '0px', top: '0px' });

const preview = computed(() =>
  props.annotation.body
    .replace(/[#*_`>\n]/g, ' ')
    .trim()
    .slice(0, 16),
);

let timer: ReturnType<typeof setTimeout> | undefined;

function show(event: Event) {
  clearTimeout(timer);
  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
  style.value = {
    left: `${Math.max(8, Math.min(bounds.left, innerWidth - 336))}px`,
    top: `${Math.max(8, Math.min(bounds.bottom + 6, innerHeight - 300))}px`,
  };
  visible.value = true;
}

function hide() {
  timer = setTimeout(() => {
    visible.value = false;
  }, 120);
}

function keepOpen() {
  clearTimeout(timer);
}

onBeforeUnmount(() => clearTimeout(timer));
</script>
<template>
  <button
    class="annotation-capsule"
    :aria-label="'查看注释：' + preview"
    :aria-describedby="visible ? 'annotation-tooltip-' + annotation.id : undefined"
    @keydown.esc="visible = false"
    @mouseenter="show"
    @mouseleave="hide"
    @focus="show"
    @blur="hide"
    @click="
      visible = false;
      emit('open');
    "
  >
    <MessageSquareText :size="12" /><span>{{ preview }}</span>
  </button>
  <Teleport to="body"
    ><Transition name="popover"
      ><aside
        v-if="visible"
        :id="'annotation-tooltip-' + annotation.id"
        class="annotation-tooltip"
        :style="style"
        role="tooltip"
        @mouseenter="keepOpen"
        @mouseleave="hide"
      >
        <MarkdownNote :text="annotation.body" /><button
          @click="
            visible = false;
            emit('open');
          "
        >
          查看 / 修改
        </button>
      </aside></Transition
    ></Teleport
  >
</template>
