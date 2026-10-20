<script setup lang="ts">
import { MessageSquareText, SquarePen, Trash2, X } from 'lucide-vue-next';
import { computed, watch } from 'vue';

import { useFloatingMenu } from '../../composables/useFloatingMenu';
import type { TextAnnotation } from '../../runtime/text-annotations';
import MarkdownNote from './MarkdownNote.vue';

const props = defineProps<{ annotation: TextAnnotation; expanded: boolean }>();
const emit = defineEmits<{ edit: []; remove: []; 'update:expanded': [value: boolean] }>();
const { open, anchor, menu, style, close } = useFloatingMenu({ align: 'start', offset: 36 });

const preview = computed(() =>
  props.annotation.body
    .replace(/[#*_`>\n]/g, ' ')
    .trim()
    .slice(0, 20),
);

watch(
  () => props.expanded,
  value => {
    open.value = value;
  },
  { immediate: true },
);
watch(open, value => emit('update:expanded', value));
</script>

<template>
  <span ref="anchor" class="annotation-control">
    <button
      class="annotation-capsule"
      :class="{ active: expanded }"
      :aria-label="'查看注释：' + preview"
      :aria-expanded="expanded"
      :aria-controls="'annotation-detail-' + annotation.id"
      @keydown.esc="close(true)"
      @click="open = !open"
    >
      <MessageSquareText :size="14" /><span>{{ preview }}</span>
    </button>
  </span>
  <Teleport to="body">
    <Transition name="annotation-popover" appear>
      <aside
        v-if="open"
        :id="'annotation-detail-' + annotation.id"
        ref="menu"
        class="annotation-dropdown"
        :style="style"
        aria-label="注释内容"
        @keydown.esc.stop="close(true)"
      >
        <header>
          <strong>文章注释</strong>
          <button
            class="icon-button annotation-delete"
            aria-label="删除注释"
            title="删除注释"
            @click="emit('remove')"
          >
            <Trash2 :size="16" />
          </button>
          <button
            class="icon-button"
            aria-label="修改注释"
            title="修改注释"
            @click="
              emit('edit');
              close();
            "
          >
            <SquarePen :size="16" />
          </button>
          <button class="icon-button" aria-label="收起注释" @click="close(true)">
            <X :size="16" />
          </button>
        </header>
        <MarkdownNote :text="annotation.body" />
      </aside>
    </Transition>
  </Teleport>
</template>
