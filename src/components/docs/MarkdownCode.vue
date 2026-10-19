<script setup lang="ts">
import { ref } from 'vue';

import { chapters } from '../../data/course';
import { progress } from '../../progress';
import CodeEditor from '../CodeEditor.vue';
import CodeSnippet from '../CodeSnippet.vue';

const props = defineProps<{ code: string; language?: string; editorId?: string; mode?: string }>();
const editing = ref(false);

const owner = chapters.find(chapter =>
  chapter.lessons.some(
    lesson => props.editorId === lesson.id || props.editorId?.startsWith(`${lesson.id}-guide-`),
  ),
);

const lesson = owner?.lessons.find(
  lesson => props.editorId === lesson.id || props.editorId?.startsWith(`${lesson.id}-guide-`),
);
</script>
<template>
  <CodeEditor
    v-if="editorId && (mode === 'playground' || editing)"
    :key="editorId"
    :editor-id="editorId"
    :initial-code="code"
    :returnable="mode !== 'playground'"
    :dependencies="lesson?.dependencies ?? owner?.dependencies"
    :native-required="lesson?.nativeRequired ?? owner?.nativeRequired"
    @back="editing = false"
  />
  <CodeSnippet
    v-else
    :code="(editorId && progress.drafts[editorId]) || code"
    :language="language"
    :editable="mode === 'runnable'"
    @edit="editing = true"
  />
</template>
