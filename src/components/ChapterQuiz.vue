<script setup lang="ts">
import {
  Check,
  ArrowRight,
  LockKeyhole,
  Lightbulb,
  FlaskConical,
  LoaderCircle,
  Trophy,
  CircleAlert,
} from 'lucide-vue-next';
import { computed, ref, onMounted, type ComponentPublicInstance } from 'vue';

import { progress, recordActivity } from '../progress';
import { checkProgram } from '../runtime/assessment';
import type { Chapter, Question } from '../runtime/course';
import { terminalHtml } from '../runtime/terminal';
import BrowserOnly from './BrowserOnly.vue';
import CodeEditor from './CodeEditor.vue';
import CodeSnippet from './CodeSnippet.vue';
import ContentDocument from './docs/ContentDocument.vue';
import SyntaxText from './SyntaxText.vue';
const props = defineProps<{ chapter: Chapter; project?: boolean }>();
const emit = defineEmits<{ reward: [message: string] }>();
const busy = ref(false);
const status = ref('');
const currentCheck = ref('');
const reveals = ref<Record<string, { explanation: string; answer: string }>>({});
const editors = new Map<string, InstanceType<typeof CodeEditor>>();
const unlocked = computed(() => props.chapter.questions.every(q => progress.passed.includes(q.id)));

const questions = computed<Question[]>(() =>
  props.project
    ? [
        {
          id: `${props.chapter.id}-project`,
          kind: 'code',
          title: props.chapter.project.title,
          prompt: props.chapter.project.description,
          starter: props.chapter.project.starter,
          document: props.chapter.project.document,
        },
      ]
    : props.chapter.questions,
);

const passedCount = computed(
  () => questions.value.filter(q => progress.passed.includes(q.id)).length,
);

const allPassed = computed(() => passedCount.value === questions.value.length);

const i = computed(() =>
  props.project
    ? 0
    : Math.min(progress.questions[props.chapter.id] ?? 0, questions.value.length - 1),
);

const q = computed(() => questions.value[i.value]!);

function selectQuestion(index: number) {
  if (busy.value || index < 0 || index >= questions.value.length) {
    return;
  }

  progress.questions[props.chapter.id] = index;
  status.value = '';
}

const attempts = (id: string) => progress.attempts[id] ?? 0;

function storeEditor(id: string, value: Element | ComponentPublicInstance | null) {
  if (value) {
    editors.set(id, value as InstanceType<typeof CodeEditor>);
  } else {
    editors.delete(id);
  }
}

async function checkQuestion(question: Question) {
  const { assessments } = await import('../runtime/assessments');
  const item = assessments[question.id]!;

  if (question.kind !== 'code') {
    return {
      success: item.accept!(progress.answers[question.id] ?? ''),
      message: '还差一点，重新推演代码或回顾对应概念，再试一次。',
    };
  }

  const source =
    editors.get(question.id)?.getCode() ?? progress.drafts[question.id] ?? question.starter!;

  const result = await checkProgram(source, item.tests!, {
    dependencies: editors.get(question.id)?.getDependencies() ?? props.chapter.dependencies,
    nativeRequired: props.chapter.nativeRequired,
  });

  return { success: result.success, message: result.stderr || '断言未全部通过，请检查边界条件。' };
}

function recordCorrectAnswer(question: Question) {
  if (progress.passed.includes(question.id)) {
    return;
  }

  progress.passed.push(question.id);
  recordActivity();
  emit('reward', props.project ? '项目验收通过！+100 XP' : '这道题通过了！+30 XP');
}

async function submit(question: Question) {
  if (busy.value) {
    return;
  }

  if (question.kind !== 'code' && !progress.answers[question.id]?.trim()) {
    status.value = '先写下这道题的答案，再提交检查。';
    return;
  }

  busy.value = true;
  currentCheck.value = question.id;
  status.value = '';

  try {
    const result = await checkQuestion(question);
    progress.feedback[question.id] = {
      success: result.success,
      message: result.success ? '回答正确，这一步理解已掌握。' : result.message,
    };

    if (result.success) {
      recordCorrectAnswer(question);

      if (allPassed.value) {
        status.value = props.project ? '项目全部测试通过！' : '全部题目通过，专项实操已解锁。';
      }
    } else {
      progress.attempts[question.id] = attempts(question.id) + 1;
    }
  } catch (error) {
    progress.feedback[question.id] = {
      success: false,
      message: error instanceof Error ? error.message : '检查暂时失败，请重试。',
    };
  } finally {
    busy.value = false;
    currentCheck.value = '';
  }
}

async function reveal(id: string) {
  if (attempts(id) < 3) {
    return;
  }

  const { assessments } = await import('../runtime/assessments');
  const item = assessments[id]!;

  if (!progress.revealed.includes(id)) {
    progress.revealed.push(id);
  }

  reveals.value[id] = { explanation: item.explanation, answer: item.answer };
}

onMounted(() => {
  for (const question of questions.value) {
    if (progress.revealed.includes(question.id)) {
      void reveal(question.id);
    }
  }
});
</script>
<template>
  <div v-if="project && !unlocked" class="locked-project">
    <div class="locked-symbol"><LockKeyhole :size="28" /></div>
    <span class="eyebrow">BUILD SOMETHING REAL</span>
    <h2>{{ chapter.project.title }}</h2>
    <p>
      完成本章整张试卷的
      {{ chapter.questions.length }}
      道题，解锁综合实操。<br />把当前章节与之前学到的知识，连接起来。
    </p>
    <div class="lock-progress">
      <span
        v-for="q in chapter.questions"
        :key="q.id"
        :class="{ done: progress.passed.includes(q.id) }"
        ><Check v-if="progress.passed.includes(q.id)" :size="14" /><LockKeyhole v-else :size="12"
      /></span>
    </div>
  </div>
  <section v-else class="assessment exam-paper">
    <div class="paper-heading">
      <div>
        <span class="eyebrow">{{ project ? 'CHAPTER PROJECT' : 'CHAPTER CHECKPOINT' }}</span>
        <h2>{{ project ? '用一个作品，连接知识。' : `${chapter.title} · 章节小试卷` }}</h2>
      </div>
      <span class="paper-score"
        >{{ passedCount }}<small>/ {{ questions.length }} 已通过</small></span
      >
    </div>
    <p class="paper-intro">
      {{
        project
          ? '按需求完成实现，然后提交全部测试。'
          : '按顺序完成概念判断、代码填空与编程。每道题独立提交、立即反馈，答对后继续下一题；每道错题独立尝试 3 次后才能查看解析。'
      }}
    </p>
    <div class="paper-overview">
      <button
        v-for="(question, index) in questions"
        :key="question.id"
        :aria-label="'第 ' + (index + 1) + ' 题'"
        :aria-current="i === index ? 'step' : undefined"
        :disabled="busy"
        @click="selectQuestion(index)"
        :class="{
          current: i === index,
          done: progress.passed.includes(question.id),
          wrong: progress.feedback[question.id] && !progress.feedback[question.id]?.success,
        }"
      >
        <Check v-if="progress.passed.includes(question.id)" :size="13" /><span v-else>{{
          index + 1
        }}</span></button
      ><span>{{ project ? '项目验收' : '逐题提交 · 即时反馈' }}</span>
    </div>
    <Transition name="question-swap" mode="out-in"
      ><article
        :id="`question-${q.id}`"
        :key="q.id"
        class="paper-question"
        :class="{ answered: progress.passed.includes(q.id) }"
      >
        <div class="question-heading">
          <span class="question-type"
            >{{ String(i + 1).padStart(2, '0') }} /
            {{
              {
                choice: '概念与代码选择',
                fill: '代码填空',
                code: project ? '综合实操' : '真实编程',
              }[q.kind]
            }}</span
          ><span v-if="progress.passed.includes(q.id)" class="success-text"
            ><Check :size="14" />已通过</span
          ><span v-else class="xp-pill">+{{ project ? 100 : 30 }} XP</span>
        </div>
        <h3 class="paper-question-title">{{ q.title }}</h3>
        <ContentDocument :path="q.document!" />
        <div v-if="q.kind === 'choice'" class="options">
          <button
            v-for="(option, index) in q.options"
            :key="option"
            :class="{ selected: progress.answers[q.id] === option }"
            :disabled="busy || progress.passed.includes(q.id)"
            @click="progress.answers[q.id] = option"
          >
            <span>{{ String.fromCharCode(65 + index) }}</span
            ><SyntaxText :text="option" />
            <div class="radio"><i v-if="progress.answers[q.id] === option" /></div>
          </button>
        </div>
        <label v-else-if="q.kind === 'fill'" class="fill-field"
          >填入缺失的代码<input
            v-model="progress.answers[q.id]"
            autocomplete="off"
            :disabled="busy || progress.passed.includes(q.id)"
            placeholder="写下你的答案…"
        /></label>
        <BrowserOnly v-else>
          <CodeEditor
            :ref="value => storeEditor(q.id, value)"
            :editor-id="q.id"
            :initial-code="q.starter!"
            :dependencies="chapter.dependencies"
            :native-required="chapter.nativeRequired"
            compact
          />
          <template #fallback><CodeSnippet :code="q.starter!" /></template>
        </BrowserOnly>
        <div
          v-if="progress.feedback[q.id]"
          class="feedback"
          :class="{ incorrect: !progress.feedback[q.id]?.success }"
          role="status"
        >
          <Check v-if="progress.feedback[q.id]?.success" :size="18" /><Lightbulb
            v-else
            :size="18"
          />
          <pre v-html="terminalHtml(progress.feedback[q.id]?.message ?? '')" />
        </div>
        <div v-if="!progress.passed.includes(q.id)" class="question-attempts">
          <span>独立尝试 {{ attempts(q.id) }} 次</span
          ><span v-if="attempts(q.id) < 3">再尝试 {{ 3 - attempts(q.id) }} 次后可查看解析</span
          ><button v-else class="text-button" @click="reveal(q.id)">
            <Lightbulb :size="15" />主动查看这道题的解析
          </button>
        </div>
        <div class="question-submit">
          <button
            v-if="!project && i > 0"
            class="text-button previous-question"
            :disabled="busy"
            @click="selectQuestion(i - 1)"
          >
            上一题
          </button>
          <button
            v-if="!progress.passed.includes(q.id)"
            class="primary-button"
            :disabled="busy"
            @click="submit(q)"
          >
            <LoaderCircle v-if="currentCheck === q.id" class="spin" :size="16" /><FlaskConical
              v-else
              :size="16"
            />{{ currentCheck === q.id ? '正在检查…' : project ? '提交项目验收' : '提交这道题'
            }}<ArrowRight :size="15" /></button
          ><button
            v-else-if="i < questions.length - 1"
            class="secondary-button"
            @click="selectQuestion(i + 1)"
          >
            继续下一题<ArrowRight :size="15" />
          </button>
        </div>
        <div v-if="reveals[q.id]" class="answer-reveal">
          <p><SyntaxText :text="reveals[q.id]!.explanation" /></p>
          <strong>参考答案</strong
          ><CodeSnippet v-if="q.kind === 'code'" :code="reveals[q.id]!.answer" /><SyntaxText
            v-else
            :text="reveals[q.id]!.answer"
          />
        </div></article
    ></Transition>
    <div class="paper-submit">
      <div>
        <strong>{{ allPassed ? '这一站，顺利抵达。' : '每一次提交，都能看到进步。' }}</strong>
        <p>
          {{
            allPassed
              ? '全部题目已通过，可以进入专项实操。'
              : '逐题完成即可，已经答对的题会一直保留。'
          }}
        </p>
      </div>
      <span class="paper-score"
        >{{ passedCount }}<small>/ {{ questions.length }}</small></span
      >
    </div>
    <p v-if="currentCheck" class="paper-status">正在编译并运行当前题的测试…</p>
    <div v-if="status" class="feedback" role="status">
      <CircleAlert :size="18" />
      <pre>{{ status }}</pre>
    </div>
    <div v-if="unlocked && !project" class="unlock-banner">
      <Trophy :size="26" />
      <div>
        <strong>整张试卷通过！</strong>
        <p>专项实操已经解锁，去完成一个综合作品吧。</p>
      </div>
    </div>
  </section>
</template>
