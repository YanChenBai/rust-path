<script setup lang="ts">
import {
  NotebookPen,
  MessageSquareText,
  MessageSquarePlus,
  SquarePen,
  X,
  Check,
  Trash2,
} from 'lucide-vue-next';
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

import { useFloatingMenu } from '../../composables/useFloatingMenu';
import { useTextAnnotations } from '../../composables/useTextAnnotations';
import { progress } from '../../progress';
import type { Chapter } from '../../runtime/course';
import type { TextAnnotation } from '../../runtime/text-annotations';
import AnnotationCapsule from './AnnotationCapsule.vue';
import MarkdownNote from './MarkdownNote.vue';

const props = defineProps<{ chapter: Chapter; lessonId: string; content?: HTMLElement }>();
const emit = defineEmits<{ navigate: [id: string] }>();

const { selection, selectionStyle, markers, selectedId } = useTextAnnotations(
  () => props.content,
  () => props.lessonId,
);

const {
  open: menuOpen,
  anchor: floating,
  menu,
  style: menuStyle,
  keydown: menuKeydown,
} = useFloatingMenu();

const modal = ref(false);
const chapterEditing = ref(false);
const chapterDraft = ref('');
const chapterInput = ref<HTMLTextAreaElement>();
const draft = ref('');
const original = ref('');
const active = ref<TextAnnotation>();
const activeLessonId = ref('');
const dialog = ref<HTMLElement>();
const input = ref<HTMLTextAreaElement>();
const pendingJump = ref<string>();
const jumpMessage = ref('');
let previousFocus: HTMLElement | null = null;
let previousOverflow = '';
const chapterNote = computed(() => progress.chapterNotes[props.chapter.id] ?? '');

const chapterAnnotations = computed(() =>
  props.chapter.lessons.flatMap(lesson =>
    (progress.annotations[lesson.id] ?? []).map(annotation => ({ lesson, annotation })),
  ),
);

function openEditor(value: string) {
  draft.value = value;
  original.value = value;
  menuOpen.value = false;
  modal.value = true;
}

async function editChapter() {
  chapterDraft.value = chapterNote.value;
  chapterEditing.value = true;
  await nextTick();
  chapterInput.value?.focus();
}

function saveChapter() {
  progress.chapterNotes[props.chapter.id] = chapterDraft.value;
  chapterEditing.value = false;
}

function editAnnotation(annotation: TextAnnotation, lessonId: string) {
  active.value = annotation;
  activeLessonId.value = lessonId;
  openEditor(annotation.body);
}

function addAnnotation() {
  if (!selection.value) {
    return;
  }

  const annotation = {
    ...selection.value.anchor,
    id: crypto.randomUUID(),
    body: '',
    createdAt: Date.now(),
  };

  selection.value = undefined;
  window.getSelection()?.removeAllRanges();
  editAnnotation(annotation, props.lessonId);
}

function save() {
  if (!active.value || !draft.value.trim()) {
    return;
  }

  const updated = { ...active.value, body: draft.value };
  const entries = progress.annotations[activeLessonId.value] ?? [];
  progress.annotations[activeLessonId.value] = [
    ...entries.filter(item => item.id !== updated.id),
    updated,
  ];
  selectedId.value = updated.id;

  modal.value = false;
}

function removeAnnotation() {
  if (!active.value || !confirm('删除这条文字注释？')) {
    return;
  }

  progress.annotations[activeLessonId.value] = (
    progress.annotations[activeLessonId.value] ?? []
  ).filter(item => item.id !== active.value!.id);
  selectedId.value = undefined;
  modal.value = false;
}

function close() {
  if (draft.value !== original.value && !confirm('还有未保存的内容，确定放弃修改？')) {
    return;
  }

  modal.value = false;
}

function revealAnnotation() {
  const marker = markers.value.find(item => item.annotation.id === pendingJump.value);

  if (!marker) {
    return false;
  }

  selectedId.value = marker.annotation.id;
  marker.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  marker.element.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
  pendingJump.value = undefined;
  menuOpen.value = false;
  return true;
}

function jump(annotation: TextAnnotation, lessonId: string) {
  jumpMessage.value = '';
  pendingJump.value = annotation.id;

  if (lessonId !== props.lessonId || progress.tab !== 'lesson') {
    emit('navigate', lessonId);
    return;
  }

  if (!revealAnnotation()) {
    pendingJump.value = undefined;
    jumpMessage.value = '原文已变更，暂时无法定位。注释仍保留，可在列表中查看和修改。';
  }
}

watch(markers, async () => {
  if (!pendingJump.value) {
    return;
  }

  await nextTick();

  if (!revealAnnotation() && props.content?.querySelector('.markdown-document')) {
    pendingJump.value = undefined;
    jumpMessage.value = '原文已变更，暂时无法定位。注释仍保留，可在列表中查看和修改。';
    menuOpen.value = true;
  }
});

function keyboard(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault();
    close();
  }

  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    save();
  }

  if (event.key !== 'Tab') {
    return;
  }

  trapFocus(event);
}

function trapFocus(event: KeyboardEvent) {
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

watch(modal, async value => {
  if (!value) {
    document.documentElement.style.overflow = previousOverflow;

    if (previousFocus?.isConnected) {
      previousFocus.focus();
    }

    return;
  }

  previousFocus = document.activeElement as HTMLElement;
  previousOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  await nextTick();
  input.value?.focus();
});
watch(
  () => props.chapter.id,
  () => {
    chapterEditing.value = false;
  },
);
watch(
  () => props.lessonId,
  () => {
    modal.value = false;
    selectedId.value = undefined;
    menuOpen.value = false;
  },
);
onBeforeUnmount(() => {
  if (modal.value) {
    document.documentElement.style.overflow = previousOverflow;
  }
});
</script>

<template>
  <section class="chapter-notes" aria-label="章节笔记">
    <header>
      <div>
        <h2><NotebookPen :size="19" />章节笔记</h2>
        <p>{{ chapter.title }} · 本章各节共用</p>
      </div>
      <button v-if="!chapterEditing" class="secondary-button" @click="editChapter">
        <SquarePen :size="15" />{{ chapterNote.trim() ? '修改笔记' : '写笔记' }}
      </button>
    </header>
    <div v-if="chapterEditing" class="chapter-note-editor">
      <label for="chapter-note-draft" class="notes-input-label">Markdown 内容</label>
      <textarea
        id="chapter-note-draft"
        ref="chapterInput"
        v-model="chapterDraft"
        class="notes-markdown-input"
        placeholder="## 我的理解&#10;&#10;支持 **重点**、列表、引用和代码块…"
        @keydown.ctrl.enter.prevent="saveChapter"
        @keydown.meta.enter.prevent="saveChapter"
      />
      <footer class="chapter-note-actions">
        <span
          >{{ chapterDraft === chapterNote ? '内容未修改' : '尚未保存' }} · Ctrl / ⌘ + Enter
          保存</span
        >
        <button class="secondary-button" @click="chapterEditing = false">取消</button>
        <button class="primary-button" @click="saveChapter"><Check :size="15" />保存笔记</button>
      </footer>
    </div>
    <MarkdownNote v-else-if="chapterNote.trim()" :text="chapterNote" />
    <p v-else class="notes-empty">
      把这一章的理解留在这里。支持 Markdown，编辑后点击「保存笔记」。
    </p>
  </section>
  <Teleport v-for="marker in markers" :key="marker.annotation.id" :to="marker.element">
    <AnnotationCapsule
      :annotation="marker.annotation"
      :expanded="selectedId === marker.annotation.id"
      @update:expanded="
        value => {
          if (value) selectedId = marker.annotation.id;
          else if (selectedId === marker.annotation.id) selectedId = undefined;
        }
      "
      @edit="editAnnotation(marker.annotation, lessonId)"
    />
  </Teleport>
  <Teleport to="body">
    <button
      v-if="selection && !modal"
      class="selection-annotate"
      :style="selectionStyle"
      @pointerdown.prevent
      @click="addAnnotation"
    >
      <MessageSquarePlus :size="15" />添加注释
    </button>
    <div ref="floating" class="study-notes-floating">
      <button
        class="study-notes-trigger"
        aria-label="本章注释列表"
        :aria-expanded="menuOpen"
        aria-controls="chapter-annotations"
        @keydown.esc="menuOpen = false"
        @click="menuOpen = !menuOpen"
      >
        <MessageSquareText :size="19" /><span>本章注释</span><b>{{ chapterAnnotations.length }}</b>
      </button>
    </div>
    <Transition name="annotation-popover">
      <nav
        v-if="menuOpen"
        id="chapter-annotations"
        ref="menu"
        class="study-annotations-menu"
        :style="menuStyle"
        aria-label="本章注释"
        @keydown="menuKeydown"
      >
        <header>
          <strong>本章注释 · {{ chapterAnnotations.length }}</strong
          ><button class="icon-button" aria-label="关闭注释列表" @click="menuOpen = false">
            <X :size="16" />
          </button>
        </header>
        <p v-if="!chapterAnnotations.length" class="notes-empty">
          选中正文文字，点击「添加注释」。保存后可从这里跳回原文。
        </p>
        <p v-if="jumpMessage" role="status" class="notes-empty">{{ jumpMessage }}</p>
        <article
          v-for="entry in chapterAnnotations"
          :key="entry.annotation.id"
          class="chapter-annotation-entry"
        >
          <button
            role="menuitem"
            class="annotation-list-item"
            @click="jump(entry.annotation, entry.lesson.id)"
          >
            <small>{{ entry.lesson.title }} · 跳转原文</small>
            <blockquote>{{ entry.annotation.quote }}</blockquote>
            <span>{{ entry.annotation.body.slice(0, 100) }}</span>
          </button>
          <button
            class="annotation-edit"
            @click="editAnnotation(entry.annotation, entry.lesson.id)"
          >
            <SquarePen :size="14" />修改
          </button>
        </article>
      </nav>
    </Transition>
    <div v-if="modal" class="modal-backdrop notes-backdrop" @click.self="close" @keydown="keyboard">
      <section
        ref="dialog"
        class="dialog study-notes-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="编辑文字注释"
      >
        <header class="dialog-header">
          <div>
            <p>{{ chapter.title }}</p>
            <h2>编辑文字注释</h2>
          </div>
          <button class="icon-button" aria-label="关闭编辑" @click="close"><X :size="19" /></button>
        </header>
        <blockquote class="annotation-quote">
          {{ active?.quote }}
        </blockquote>
        <div class="notes-modal-body">
          <label for="note-draft" class="notes-input-label">Markdown 内容</label
          ><textarea
            id="note-draft"
            ref="input"
            v-model="draft"
            :maxlength="20000"
            class="notes-markdown-input"
            placeholder="## 我的理解&#10;&#10;支持 **重点**、列表、引用和代码块…"
          />
        </div>
        <footer class="notes-editor-footer">
          <button v-if="active?.body" class="annotation-edit" @click="removeAnnotation">
            <Trash2 :size="15" />删除注释</button
          ><span>Ctrl / ⌘ + Enter 保存</span
          ><button class="secondary-button" @click="close">取消</button
          ><button class="primary-button" :disabled="!draft.trim()" @click="save">
            <Check :size="15" />保存注释
          </button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>
