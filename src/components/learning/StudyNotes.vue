<script setup lang="ts">
import { NotebookPen, MessageSquarePlus, SquarePen, X, Check, Trash2 } from 'lucide-vue-next';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { useTextAnnotations } from '../../composables/useTextAnnotations';
import type { Chapter } from '../../data/course';
import { progress } from '../../progress';
import type { TextAnnotation } from '../../runtime/text-annotations';
import AnnotationCapsule from './AnnotationCapsule.vue';
import MarkdownNote from './MarkdownNote.vue';

const props = defineProps<{ chapter: Chapter; lessonId: string; content?: HTMLElement }>();

const { selection, selectionStyle, markers } = useTextAnnotations(
  () => props.content,
  () => props.lessonId,
);

const menuOpen = ref(false);
const modal = ref(false);
const mode = ref<'chapter' | 'annotations' | 'annotation'>('chapter');
const editing = ref(false);
const draft = ref('');
const active = ref<TextAnnotation>();
const activeLessonId = ref('');
const dialog = ref<HTMLElement>();
const input = ref<HTMLTextAreaElement>();
const floating = ref<HTMLElement>();
let previousFocus: HTMLElement | null = null;
let previousOverflow = '';
const chapterNote = computed(() => progress.chapterNotes[props.chapter.id] ?? '');

const chapterAnnotations = computed(() =>
  props.chapter.lessons.flatMap(lesson =>
    (progress.annotations[lesson.id] ?? []).map(annotation => ({ lesson, annotation })),
  ),
);

function openChapter() {
  mode.value = 'chapter';
  editing.value = !chapterNote.value.trim();
  draft.value = chapterNote.value;
  menuOpen.value = false;
  modal.value = true;
}

function openList() {
  mode.value = 'annotations';
  editing.value = false;
  menuOpen.value = false;
  modal.value = true;
}

function openAnnotation(annotation: TextAnnotation, lessonId: string) {
  active.value = annotation;
  activeLessonId.value = lessonId;
  mode.value = 'annotation';
  draft.value = annotation.body;
  editing.value = false;
  modal.value = true;
}

function addAnnotation() {
  if (!selection.value) {
    return;
  }

  active.value = {
    ...selection.value.anchor,
    id: crypto.randomUUID(),
    body: '',
    createdAt: Date.now(),
  };
  activeLessonId.value = props.lessonId;
  selection.value = undefined;
  window.getSelection()?.removeAllRanges();
  draft.value = '';
  mode.value = 'annotation';
  editing.value = true;
  modal.value = true;
}

function saveAnnotation() {
  if (!active.value || !draft.value.trim()) {
    return;
  }

  const updated = { ...active.value, body: draft.value };
  const entries = progress.annotations[activeLessonId.value] ?? [];
  progress.annotations[activeLessonId.value] = [
    ...entries.filter(item => item.id !== updated.id),
    updated,
  ];
  active.value = updated;
  editing.value = false;
}

function removeAnnotation() {
  if (!active.value) {
    return;
  }

  progress.annotations[activeLessonId.value] = (
    progress.annotations[activeLessonId.value] ?? []
  ).filter(item => item.id !== active.value!.id);
  mode.value = 'annotations';
  editing.value = false;
}

function close() {
  modal.value = false;
}

function keyboard(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault();
    close();
  }

  if (event.key === 'Tab') {
    const elements = [
      ...(dialog.value?.querySelectorAll<HTMLElement>('button:not(:disabled), textarea, a[href]') ??
        []),
    ];

    const first = elements[0];
    const last = elements.at(-1);

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
}

watch(draft, value => {
  if (modal.value && mode.value === 'chapter' && editing.value) {
    progress.chapterNotes[props.chapter.id] = value;
  }
});
watch([editing, mode], async ([value]) => {
  await nextTick();

  if (!modal.value) {
    return;
  }

  if (value) {
    input.value?.focus();
  } else if (!dialog.value?.contains(document.activeElement)) {
    dialog.value?.querySelector<HTMLElement>('button')?.focus();
  }
});
watch(modal, async value => {
  if (!value) {
    document.documentElement.style.overflow = previousOverflow;

    if (previousFocus?.isConnected) {
      previousFocus.focus();
    } else {
      floating.value?.querySelector('button')?.focus();
    }

    return;
  }

  previousFocus = document.activeElement as HTMLElement;
  previousOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  await nextTick();
  (input.value ?? dialog.value?.querySelector<HTMLElement>('button'))?.focus();
});
watch(
  () => props.lessonId,
  () => {
    close();
    menuOpen.value = false;
  },
);

function closeMenuOutside(event: PointerEvent) {
  if (!floating.value?.contains(event.target as Node)) {
    menuOpen.value = false;
  }
}

onMounted(() => document.addEventListener('pointerdown', closeMenuOutside));
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', closeMenuOutside);

  if (modal.value) {
    document.documentElement.style.overflow = previousOverflow;
  }
});
</script>

<template>
  <Teleport v-for="marker in markers" :key="marker.annotation.id" :to="marker.element"
    ><AnnotationCapsule
      :annotation="marker.annotation"
      @open="openAnnotation(marker.annotation, lessonId)"
  /></Teleport>
  <Teleport to="body">
    <Transition name="popover"
      ><button
        v-if="selection && !modal"
        class="selection-annotate"
        :style="selectionStyle"
        @pointerdown.prevent
        @click="addAnnotation"
      >
        <MessageSquarePlus :size="15" />添加注释
      </button></Transition
    >
    <div ref="floating" class="study-notes-floating" @keydown.esc="menuOpen = false">
      <Transition name="popover"
        ><nav v-if="menuOpen" class="study-notes-menu" aria-label="笔记菜单">
          <button @click="openChapter"><NotebookPen :size="16" />章节笔记</button
          ><button @click="openList">
            <MessageSquarePlus :size="16" />本章注释<span>{{ chapterAnnotations.length }}</span>
          </button>
        </nav></Transition
      >
      <button
        class="study-notes-trigger"
        aria-label="打开笔记菜单"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <NotebookPen :size="19" /><span>笔记</span>
      </button>
    </div>
    <Transition name="modal"
      ><div
        v-if="modal"
        class="modal-backdrop notes-backdrop"
        @click.self="close"
        @keydown="keyboard"
      >
        <section
          ref="dialog"
          class="dialog study-notes-dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="mode === 'chapter' ? '章节笔记' : '文字注释'"
        >
          <header class="dialog-header">
            <div>
              <p>{{ chapter.title }}</p>
              <h2>
                {{
                  mode === 'chapter'
                    ? '章节笔记'
                    : mode === 'annotations'
                      ? '本章文字注释'
                      : '文字注释'
                }}
              </h2>
            </div>
            <button class="icon-button" aria-label="关闭笔记" @click="close">
              <X :size="19" />
            </button>
          </header>
          <template v-if="mode === 'annotations'"
            ><div class="notes-modal-body">
              <p v-if="!chapterAnnotations.length" class="notes-empty">
                阅读时选中文字，就可以添加第一条注释。
              </p>
              <button
                v-for="entry in chapterAnnotations"
                :key="entry.annotation.id"
                class="annotation-list-item"
                @click="openAnnotation(entry.annotation, entry.lesson.id)"
              >
                <small>{{ entry.lesson.title }}</small>
                <blockquote>{{ entry.annotation.quote }}</blockquote>
                <span>{{ entry.annotation.body.slice(0, 100) }}</span>
              </button>
            </div></template
          >
          <template v-else>
            <blockquote v-if="mode === 'annotation'" class="annotation-quote">
              {{ active?.quote }}
            </blockquote>
            <div class="notes-modal-toolbar">
              <span>{{
                editing
                  ? 'Markdown · ' + (mode === 'chapter' ? '自动保存' : '保存后显示在原文旁')
                  : 'Markdown 笔记'
              }}</span
              ><button v-if="!editing" @click="editing = true"><SquarePen :size="15" />修改</button
              ><button v-else-if="mode === 'chapter'" @click="editing = false">
                <Check :size="15" />查看</button
              ><button v-else :disabled="!draft.trim()" @click="saveAnnotation">
                <Check :size="15" />保存注释</button
              ><button
                v-if="mode === 'annotation' && active?.body"
                class="annotation-delete"
                aria-label="删除注释"
                @click="removeAnnotation"
              >
                <Trash2 :size="15" />
              </button>
            </div>
            <div class="notes-modal-body">
              <textarea
                v-if="editing"
                ref="input"
                v-model="draft"
                :maxlength="mode === 'annotation' ? 20000 : undefined"
                class="notes-markdown-input"
                aria-label="Markdown 笔记内容"
                placeholder="## 我的理解&#10;&#10;支持 **重点**、列表、引用和代码块…"
              /><MarkdownNote v-else-if="draft.trim()" :text="draft" />
              <p v-else class="notes-empty">暂时没有笔记，点击修改记录你的理解。</p>
            </div>
          </template>
        </section>
      </div></Transition
    >
  </Teleport>
</template>
