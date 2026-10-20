<script setup lang="ts">
import {
  Play,
  MessageSquareText,
  RotateCcw,
  Square,
  Terminal,
  Check,
  LoaderCircle,
  Columns2,
  Rows2,
  FileCog,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  Search,
  Menu,
  Braces,
} from 'lucide-vue-next';
import type * as Monaco from 'monaco-editor/editor/editor.api.js';
import { onMounted, onBeforeUnmount, nextTick, ref, watch, computed } from 'vue';

import { useEditorPanels } from '../composables/useEditorPanels';
import { useFloatingMenu } from '../composables/useFloatingMenu';
import { progress, recordActivity, storage } from '../progress';
import { analyze } from '../runtime/analyzer';
import { commentPresentation, type CommentAwareEditor } from '../runtime/editor-comments';
import { detectNative, nativeAvailable } from '../runtime/native';
import { NativeAnalyzer } from '../runtime/native-analyzer';
import { beginResourceLoading } from '../runtime/resource-loading';
import { runRust, runtimeStatus, stopRust, type RunResult } from '../runtime/rust';
import { formatRust } from '../runtime/rust-formatter';
import NativeServiceSettings from './layout/NativeServiceSettings.vue';
import ResourceLoading from './layout/ResourceLoading.vue';
import TerminalView from './TerminalView.vue';

const props = withDefaults(
  defineProps<{
    editorId: string;
    initialCode: string;
    compact?: boolean;
    returnable?: boolean;
    dependencies?: string[];
    nativeRequired?: boolean;
  }>(),
  { compact: false },
);

const emit = defineEmits<{
  success: [];
  change: [code: string];
  back: [];
  search: [];
  navigation: [];
}>();

const host = ref<HTMLElement>();

const maximized = ref(false);
const editorElement = ref<HTMLElement>();
const placeholderHeight = ref(0);
let fullscreenAnimation: Animation | undefined;
let fullscreenRevision = 0;

const liveText = ref(
  progress.outputs[props.editorId]?.transcript ??
    [progress.outputs[props.editorId]?.stdout, progress.outputs[props.editorId]?.stderr]
      .filter(Boolean)
      .join(''),
);

let previousOverflow = '';

function escapeEditor(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    if (commandOpen.value) {
      closeCommandMenu(true);
      event.stopPropagation();
      return;
    }

    maximized.value = false;
  }
}

onMounted(() => window.addEventListener('keydown', escapeEditor, true));
watch(maximized, async value => {
  const revision = ++fullscreenRevision;
  const before = editorElement.value?.getBoundingClientRect();
  fullscreenAnimation?.cancel();

  if (value) {
    placeholderHeight.value = before?.height ?? 0;
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
  } else {
    document.documentElement.style.overflow = previousOverflow;
  }

  await nextTick();

  if (disposed || revision !== fullscreenRevision) {
    return;
  }

  editor?.layout();
  animateFullscreen(before, value);
});

function animateFullscreen(before: DOMRect | undefined, value: boolean) {
  const element = editorElement.value;
  const after = element?.getBoundingClientRect();

  if (
    !element ||
    !before ||
    !after?.width ||
    !after.height ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  // Teleport 保留编辑器实例，用前后位置过渡，避免重建后丢失光标和撤销历史。
  fullscreenAnimation = element.animate(
    [
      {
        transform: `translate(${before.left - after.left}px, ${before.top - after.top}px) scale(${before.width / after.width}, ${before.height / after.height})`,
        borderRadius: value ? '8px' : '0px',
        zIndex: '1000',
      },
      { transform: 'none', borderRadius: value ? '0px' : '8px', zIndex: '1000' },
    ],
    { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  );
}

const loading = ref(true);
let editorLoading: ReturnType<typeof beginResourceLoading> | undefined;
let analyzerLoading: ReturnType<typeof beginResourceLoading> | undefined;
const busy = ref(false);
const formatting = ref(false);

const analyzer = ref('语义引擎加载中');
const result = ref<RunResult | undefined>(progress.outputs[props.editorId]);
const error = ref('');
const activeFile = ref<'rust' | 'toml'>('rust');

const {
  open: commandOpen,
  anchor: commandRoot,
  menu: commandMenu,
  style: commandMenuStyle,
  keydown: commandKeydown,
  close: closeCommandMenu,
} = useFloatingMenu();

const commands = [
  { mode: 'run' as const, label: '运行程序', hint: 'cargo run' },
  { mode: 'check' as const, label: '检查代码', hint: 'cargo check' },
  { mode: 'build' as const, label: '构建项目', hint: 'cargo build' },
  { mode: 'test' as const, label: '运行测试', hint: 'cargo test' },
];

const layout = computed({
  get: () => progress.editorLayouts[props.editorId] ?? 'vertical',
  set: value => {
    progress.editorLayouts[props.editorId] = value;
  },
});

const {
  panels,
  split,
  sourceStyle,
  panelStyle,
  resizePanels,
  resizeByKeyboard,
  updateContentHeight,
  totalHeight,
  resizeTotalHeight,
  resizeTotalByKeyboard,
  resetTotalHeight,
} = useEditorPanels(props, layout, maximized);

const selectedDependencies = computed(
  () => progress.editorDependencies[props.editorId] ?? props.dependencies ?? [],
);

const hideComments = computed({
  get: () => progress.editorCommentsHidden[props.editorId] ?? false,
  set: value => {
    progress.editorCommentsHidden[props.editorId] = value;
  },
});

const command = ref<'run' | 'check' | 'build' | 'test'>('run');

const dependencyEntries: Record<string, string> = {
  tokio: 'tokio = { version = "1", features = ["full"] }',
  serde: 'serde = { version = "1", features = ["derive"] }',
  serde_json: 'serde_json = "1"',
  anyhow: 'anyhow = "1"',
  thiserror: 'thiserror = "2"',
  reqwest:
    'reqwest = { version = "0.12", default-features = false, features = ["json", "rustls-tls"] }',
  clap: 'clap = { version = "4", features = ["derive"] }',
  tracing: 'tracing = "0.1"',
  rusqlite: 'rusqlite = { version = "0.37", features = ["bundled"] }',
};

const cargoManifest = computed(
  () =>
    `[package]\nname = "rust_path_scratch"\nversion = "0.1.0"\nedition = "2024"\n\n[dependencies]\n${Object.entries(
      dependencyEntries,
    )
      .map(([name, line]) => (selectedDependencies.value.includes(name) ? '' : '# ') + line)
      .join('\n')}\n\n[profile.release]\nopt-level = 3`,
);

let cargoModel: Monaco.editor.ITextModel | undefined;
const dependencyWidgets: Monaco.editor.IContentWidget[] = [];
let editor: Monaco.editor.IStandaloneCodeEditor | undefined;
let model: Monaco.editor.ITextModel | undefined;
let monaco: typeof Monaco | undefined;
let native: NativeAnalyzer | undefined;
let diagnosticTimer: ReturnType<typeof setInterval> | undefined;
let disposed = false;
let ready = false;
let updateTimer: ReturnType<typeof setTimeout>;
const subscriptions: Monaco.IDisposable[] = [];

let commentDecorations: Monaco.editor.IEditorDecorationsCollection | undefined;
const commentViewSource = {};

function updateCommentView() {
  if (!editor || !model || !monaco) {
    return;
  }

  const view = editor as CommentAwareEditor;
  commentDecorations ??= editor.createDecorationsCollection();

  if (!hideComments.value || activeFile.value !== 'rust') {
    view.setHiddenAreas([], commentViewSource);
    commentDecorations.clear();
    return;
  }

  const presentation = commentPresentation(
    model.getLinesContent(),
    monaco.editor.tokenize(model.getValue(), 'rust'),
  );

  view.setHiddenAreas(presentation.hiddenLines, commentViewSource);
  commentDecorations.set(
    presentation.inlineComments.map(range => ({
      range,
      options: {
        inlineClassName: 'editor-comment-hidden',
        inlineClassNameAffectsLetterSpacing: true,
      },
    })),
  );
}

watch(hideComments, updateCommentView);
watch(activeFile, () => requestAnimationFrame(updateCommentView));

function call<T>(method: string, ...args: unknown[]): Promise<T> {
  if (native) {
    if (method === 'update') {
      return native.update(model?.getValue() ?? props.initialCode) as Promise<T>;
    }

    if (method === 'completions') {
      return native.completions(args[0] as number, args[1] as number) as Promise<T>;
    }

    if (method === 'hover') {
      return native.hover(args[0] as number, args[1] as number) as Promise<T>;
    }
  }

  return analyze<T>(method, model?.getValue() ?? props.initialCode, ...args);
}

async function updateAnalysis() {
  if (!ready || !model || disposed) {
    return;
  }

  try {
    const version = model.getVersionId();

    const data = await call<{ diagnostics: Monaco.editor.IMarkerData[] }>(
      'update',
      model.getValue(),
    );

    if (!disposed && model.getVersionId() === version) {
      monaco!.editor.setModelMarkers(model, 'rust-analyzer', data.diagnostics ?? []);
    }
  } catch {
    analyzer.value = '语义分析暂不可用';
  }
}

async function startAnalyzer() {
  analyzerLoading = beginResourceLoading('editor', '连接语义服务');
  let hasNative = await detectNative();

  if (disposed) {
    return;
  }

  if (!hasNative && !crossOriginIsolated) {
    analyzer.value = '语义引擎需要跨源隔离响应头';
    analyzerLoading.fail(analyzer.value);
    return;
  }

  try {
    if (hasNative) {
      native = new NativeAnalyzer();

      try {
        await native.open(model!.getValue(), selectedDependencies.value);
      } catch (error) {
        native.close();
        native = undefined;

        if (!crossOriginIsolated) {
          throw error;
        }

        // Cargo 可运行不代表 rust-analyzer 已安装，语义服务单独回退。
        hasNative = false;
        analyzerLoading.dispose();
        await call('update', model!.getValue());
      }

      if (disposed) {
        native?.close();
        return;
      }

      let polling = false;

      if (hasNative) {
        diagnosticTimer = setInterval(async () => {
          if (polling || disposed || !model) {
            return;
          }

          polling = true;

          try {
            const diagnostics = await native!.diagnostics();

            if (!disposed) {
              monaco!.editor.setModelMarkers(model, 'rust-analyzer', diagnostics);
            }
          } catch {
            analyzer.value = '实时诊断连接异常';
          } finally {
            polling = false;
          }
        }, 900);
      }
    } else {
      analyzerLoading.dispose();
      await call('update', model!.getValue());
    }

    if (disposed) {
      return;
    }

    ready = true;
    analyzerLoading.ready('语义服务已就绪');
    analyzer.value = hasNative ? 'rust-analyzer · 实时诊断' : 'rust-analyzer · WASM';
    await updateAnalysis();
    subscriptions.push(
      monaco!.languages.registerCompletionItemProvider('rust', {
        triggerCharacters: ['.', ':'],
        async provideCompletionItems(current, position) {
          if (current !== model || !ready) {
            return { suggestions: [] };
          }

          try {
            await call('update', current.getValue());

            const suggestions = await call<Monaco.languages.CompletionItem[] | null>(
              'completions',
              position.lineNumber,
              position.column,
            );

            return { suggestions: suggestions ?? [] };
          } catch {
            return { suggestions: [] };
          }
        },
      }),
    );
    subscriptions.push(
      monaco!.languages.registerHoverProvider('rust', {
        async provideHover(current, position) {
          if (current !== model || !ready) {
            return null;
          }

          try {
            await call('update', current.getValue());
            return await call<Monaco.languages.Hover | null>(
              'hover',
              position.lineNumber,
              position.column,
            );
          } catch {
            return null;
          }
        },
      }),
    );
  } catch {
    analyzer.value = '语义引擎加载失败，运行仍可用';
    analyzerLoading.fail(analyzer.value);
  }
}

onMounted(async () => {
  editorLoading = beginResourceLoading('editor', '加载代码编辑器', 8);
  let completed = 0;

  const imported = <T>(value: T) => {
    editorLoading?.progress(++completed, 8);
    return value;
  };

  try {
    const [api, workerModule] = await Promise.all([
      import('monaco-editor/editor/editor.api.js').then(imported),
      import('monaco-editor/editor/editor.worker.js?worker').then(imported),
    ]);

    if (disposed) {
      return;
    }

    monaco = api;
    self.MonacoEnvironment = { getWorker: () => new workerModule.default() };
    await Promise.all([
      import('monaco-editor/languages/definitions/rust/register.js').then(imported),
      import('monaco-editor/editor/contrib/hover/browser/hoverContribution.js').then(imported),
      import('monaco-editor/editor/contrib/suggest/browser/suggestController.js').then(imported),
      import('monaco-editor/editor/contrib/parameterHints/browser/parameterHints.js').then(
        imported,
      ),
      import('monaco-editor/editor/contrib/gotoError/browser/gotoError.js').then(imported),
    ]);

    // 先等 Rust 分词器就绪，再应用保存的注释视图，避免刷新后漏掉首次隐藏。
    const rustLanguage = await import('monaco-editor/languages/definitions/rust/rust.js').then(
      imported,
    );

    editorLoading.stage('初始化代码编辑器');
    monaco.languages.setMonarchTokensProvider('rust', rustLanguage.language);
    monaco.languages.setLanguageConfiguration('rust', rustLanguage.conf);

    if (disposed) {
      return;
    }

    monaco.editor.defineTheme('rust-path', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'D49EED' },
        { token: 'string', foreground: 'AFCE97' },
        { token: 'number', foreground: 'E6B47E' },
        { token: 'comment', foreground: '657267' },
      ],
      colors: {
        'editor.background': '#111111',
        'editorLineNumber.foreground': '#515158',
        'editor.lineHighlightBackground': '#1b1b1f',
        'editor.selectionBackground': '#383838',
        'editorCursor.foreground': '#eeeeee',
        'editorIndentGuide.background1': '#26262c',
      },
    });

    if (!monaco.languages.getLanguages().some(language => language.id === 'toml')) {
      monaco.languages.register({ id: 'toml' });
      monaco.languages.setMonarchTokensProvider('toml', {
        tokenizer: {
          root: [
            [/#.*/, 'comment'],
            [/\[[^\]]+\]/, 'type'],
            [/[A-Za-z_][\w-]*(?=\s*=)/, 'key'],
            [/"([^"\\]|\\.)*"/, 'string'],
            [/\b(true|false)\b/, 'keyword'],
            [/\b\d+(\.\d+)?\b/, 'number'],
            [/[{}[\]=,]/, 'delimiter'],
          ],
        },
      });
    }

    cargoModel = monaco.editor.createModel(cargoManifest.value, 'toml');
    model = monaco.editor.createModel(progress.drafts[props.editorId] ?? props.initialCode, 'rust');
    editor = monaco.editor.create(host.value!, {
      model,
      theme: 'rust-path',
      fontSize: 14,
      fontFamily: '"Cascadia Code", "SFMono-Regular", Consolas, monospace',
      lineHeight: 25,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      padding: { top: 10, bottom: 10 },
      automaticLayout: true,
      tabSize: 4,
      renderLineHighlight: 'none',
      overviewRulerLanes: 0,
      scrollbar: { verticalScrollbarSize: 5 },
      folding: false,
      lineNumbersMinChars: 3,
      lineDecorationsWidth: 8,
      glyphMargin: false,
      wordWrap: 'on',
      accessibilitySupport: 'on',
      quickSuggestions: { other: true, comments: false, strings: false },
      suggestOnTriggerCharacters: true,
      hover: { enabled: 'on' },
      ariaLabel: '可编辑的 Rust 代码',
      fixedOverflowWidgets: true,
    });
    subscriptions.push(
      editor.onDidContentSizeChange(event => {
        updateContentHeight(event.contentHeight + (activeFile.value === 'toml' ? 39 : 0));
      }),
      model.onDidChangeContent(() => {
        updateCommentView();
        const code = model!.getValue();
        progress.drafts[props.editorId] = code;
        emit('change', code);
        clearTimeout(updateTimer);
        updateTimer = setTimeout(() => void updateAnalysis(), 500);
      }),
    );
    updateContentHeight(editor.getContentHeight());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => void run());
    subscriptions.push(
      editor.addAction({
        id: 'rust-path.format',
        label: '格式化 Rust 代码',
        keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
        run: () => formatCode(),
      }),
    );
    updateCommentView();
    loading.value = false;
    editorLoading.ready('代码编辑器已就绪');
    void startAnalyzer();
  } catch (err) {
    loading.value = false;
    error.value = err instanceof Error ? err.message : '编辑器加载失败';
    editorLoading.fail(error.value);
  }
});

watch(
  () => progress.drafts[props.editorId],
  code => {
    if (typeof code === 'string' && model && model.getValue() !== code) {
      model.setValue(code);
    }
  },
);

async function run() {
  if (!model || busy.value) {
    return;
  }

  busy.value = true;
  error.value = '';
  result.value = undefined;
  liveText.value = '';

  try {
    result.value = await runRust(model.getValue(), {
      dependencies: selectedDependencies.value,
      nativeRequired: props.nativeRequired,
      mode: command.value,
      onOutput: (_channel, text) => {
        liveText.value = (liveText.value + text).slice(-128000);
      },
    });
    result.value.transcript =
      liveText.value || [result.value.stdout, result.value.stderr].filter(Boolean).join('');
    liveText.value = result.value.transcript;
    progress.outputs[props.editorId] = result.value;

    if (result.value.success && command.value === 'run') {
      if (!progress.ran.includes(props.editorId)) {
        progress.ran.push(props.editorId);
      }

      recordActivity();
      emit('success');
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '执行失败';
  } finally {
    busy.value = false;
  }
}

function reset() {
  if (confirm('恢复初始示例？当前编辑器的修改将被替换。')) {
    model?.setValue(props.initialCode);
  }
}

async function formatCode() {
  const target = model;

  if (!editor || !target || activeFile.value !== 'rust' || formatting.value) {
    return;
  }

  formatting.value = true;
  error.value = '';
  const version = target.getVersionId();

  try {
    const code = await formatRust(target.getValue());

    if (disposed || target.isDisposed()) {
      return;
    }

    if (target.getVersionId() !== version) {
      error.value = '代码已修改，请重新格式化。';
      return;
    }

    if (editor.getModel() !== target) {
      return;
    }

    editor.pushUndoStop();
    editor.executeEdits('rust-path.format', [{ range: target.getFullModelRange(), text: code }]);
    editor.pushUndoStop();
  } catch (err) {
    if (!disposed) {
      error.value = err instanceof Error ? err.message : 'Rust 格式化失败';
    }
  } finally {
    formatting.value = false;
  }
}

function getCode() {
  return model?.getValue() ?? progress.drafts[props.editorId] ?? props.initialCode;
}

function clearDependencyWidgets() {
  if (editor) {
    for (const widget of dependencyWidgets) {
      editor.removeContentWidget(widget);
    }
  }

  dependencyWidgets.length = 0;
}

function showDependencyWidgets() {
  clearDependencyWidgets();

  if (activeFile.value !== 'toml' || !editor || !cargoModel || !monaco) {
    return;
  }

  Object.keys(dependencyEntries).forEach((name, index) => {
    const node = document.createElement('label');
    node.className = 'cargo-dependency-widget';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = selectedDependencies.value.includes(name);
    input.setAttribute('aria-label', `启用 ${name} 依赖`);
    node.style.width = '16px';
    node.style.minWidth = '16px';
    node.style.whiteSpace = 'nowrap';
    input.addEventListener('change', () => {
      const next = new Set(selectedDependencies.value);

      if (input.checked) {
        next.add(name);
      } else {
        next.delete(name);
      }

      progress.editorDependencies[props.editorId] = [...next];
    });
    node.append(input);

    const widget: Monaco.editor.IContentWidget = {
      getId: () => `dependency-${props.editorId}-${name}`,
      getDomNode: () => node,
      getPosition: () => ({
        position: { lineNumber: index + 7, column: cargoModel!.getLineMaxColumn(index + 7) },
        preference: [monaco!.editor.ContentWidgetPositionPreference.EXACT],
      }),
    };

    dependencyWidgets.push(widget);
    editor!.addContentWidget(widget);
  });
}

watch(activeFile, () => {
  clearDependencyWidgets();
  editor?.setModel(activeFile.value === 'rust' ? model! : cargoModel!);
  editor?.updateOptions({ readOnly: activeFile.value === 'toml' });
  showDependencyWidgets();
  requestAnimationFrame(() => editor?.layout());
});
watch(cargoManifest, () => {
  cargoModel?.setValue(cargoManifest.value);
  showDependencyWidgets();
});
let reconnectSequence = 0;
watch(
  selectedDependencies,
  async () => {
    if (!native || disposed || !model) {
      return;
    }

    const sequence = ++reconnectSequence;
    ready = false;
    analyzer.value = '正在更新依赖索引…';
    native.close();
    const next = new NativeAnalyzer();

    try {
      await next.open(model.getValue(), selectedDependencies.value);

      if (disposed || sequence !== reconnectSequence) {
        next.close();
        return;
      }

      native = next;
      ready = true;
      analyzer.value = 'rust-analyzer · 实时诊断';
    } catch {
      analyzer.value = '依赖索引更新失败，请重开编辑器';
    }
  },
  { deep: true },
);
watch(layout, () => requestAnimationFrame(() => editor?.layout()));

defineExpose({
  getCode,
  getDependencies: () => [...selectedDependencies.value],
  setCode: (code: string) => model?.setValue(code),
});
onBeforeUnmount(() => {
  disposed = true;
  editorLoading?.dispose();
  analyzerLoading?.dispose();
  fullscreenAnimation?.cancel();

  window.removeEventListener('keydown', escapeEditor, true);

  if (maximized.value) {
    document.documentElement.style.overflow = previousOverflow;
  }

  clearInterval(diagnosticTimer);
  native?.close();
  clearTimeout(updateTimer);
  subscriptions.forEach(item => item.dispose());
  editor?.dispose();
  model?.dispose();
  cargoModel?.dispose();
});
</script>
<template>
  <div
    v-if="maximized"
    class="editor-fullscreen-placeholder"
    :style="{ height: placeholderHeight + 'px' }"
    aria-hidden="true"
  />
  <Teleport to="body" :disabled="!maximized"
    ><div
      ref="editorElement"
      class="code-editor"
      :class="{
        'layout-horizontal': layout === 'horizontal',
        'editor-maximized': maximized,
        'editor-compact': compact,
      }"
    >
      <div class="editor-toolbar">
        <button v-if="returnable" class="editor-back" aria-label="返回阅读" @click="emit('back')">
          <ArrowLeft :size="15" /><span>返回阅读</span>
        </button>
        <button
          v-if="editorId === 'playground'"
          class="icon-button mobile-menu"
          aria-label="打开课程导航"
          @click="emit('navigation')"
        >
          <Menu :size="18" />
        </button>
        <div class="editor-files" role="tablist" aria-label="工程文件">
          <button
            class="file-tab"
            role="tab"
            :aria-selected="activeFile === 'rust'"
            :class="{ active: activeFile === 'rust' }"
            @click="activeFile = 'rust'"
          >
            main.rs</button
          ><button
            class="file-tab"
            role="tab"
            :aria-selected="activeFile === 'toml'"
            :class="{ active: activeFile === 'toml' }"
            @click="activeFile = 'toml'"
          >
            <FileCog :size="14" />Cargo.toml
          </button>
        </div>
        <div class="editor-actions">
          <ResourceLoading v-if="editorId === 'playground' || maximized" />
          <NativeServiceSettings v-if="editorId === 'playground' || maximized" />
          <button
            v-if="editorId === 'playground'"
            class="icon-button"
            aria-label="搜索知识点"
            title="搜索知识点"
            @click="emit('search')"
          >
            <Search :size="16" />
          </button>
          <button
            v-if="editorId === 'playground'"
            class="icon-button"
            :aria-label="progress.focusMode ? '展开侧栏' : '收起侧栏'"
            :title="progress.focusMode ? '展开侧栏' : '收起侧栏'"
            @click="progress.focusMode = !progress.focusMode"
          >
            <PanelLeftOpen v-if="progress.focusMode" :size="16" />
            <PanelLeftClose v-else :size="16" /></button
          ><span
            class="editor-saved"
            :class="{ 'save-error': storage.error }"
            :title="storage.error || '保存在当前浏览器'"
            ><Check v-if="!storage.error" :size="12" />{{
              storage.error
                ? '保存异常'
                : storage.savedAt
                  ? '已保存 ' + storage.savedAt
                  : '已本地保存'
            }}</span
          >
          <button
            class="icon-button"
            :disabled="activeFile !== 'rust' || loading || formatting"
            title="格式化代码（Shift + Alt + F）"
            aria-label="格式化 Rust 代码"
            @click="formatCode"
          >
            <LoaderCircle v-if="formatting" :size="16" class="spin" />
            <Braces v-else :size="16" />
          </button>
          <button
            class="icon-button"
            :class="{ 'comments-hidden': hideComments }"
            :disabled="activeFile !== 'rust' || loading"
            :aria-label="hideComments ? '显示注释' : '隐藏注释'"
            :aria-pressed="hideComments"
            :title="hideComments ? '显示注释 · 原始代码始终保留' : '隐藏注释，独立思考'"
            @click="hideComments = !hideComments"
          >
            <MessageSquareText :size="16" />
          </button>
          <button
            class="icon-button layout-toggle"
            :aria-label="layout === 'vertical' ? '切换为左右布局' : '切换为上下布局'"
            :title="layout === 'vertical' ? '左右布局' : '上下布局'"
            @click="layout = layout === 'vertical' ? 'horizontal' : 'vertical'"
          >
            <Columns2 v-if="layout === 'vertical'" :size="17" /><Rows2 v-else :size="17" /></button
          ><button
            class="icon-button"
            :title="maximized ? '退出网页全屏（Esc）' : '网页全屏'"
            :aria-label="maximized ? '退出网页全屏' : '进入网页全屏'"
            @click="maximized = !maximized"
          >
            <Minimize2 v-if="maximized" :size="17" /><Maximize2 v-else :size="17" /></button
          ><button
            class="icon-button"
            title="恢复初始示例"
            aria-label="恢复初始示例"
            @click="reset"
          >
            <RotateCcw :size="16" /></button
          ><button
            v-if="busy"
            class="icon-button"
            title="停止执行"
            aria-label="停止执行"
            @click="stopRust"
          >
            <Square :size="15" />
          </button>
          <div v-else ref="commandRoot" class="command-control" @keydown.esc="commandOpen = false">
            <button
              class="icon-button command-trigger"
              :disabled="loading"
              aria-label="运行与构建命令"
              aria-haspopup="menu"
              :aria-expanded="commandOpen"
              :title="'执行命令 · 上次 cargo ' + command + '（Ctrl + Enter）'"
              @click="commandOpen = !commandOpen"
            >
              <Play :size="16" />
            </button>
            <Teleport to="body"
              ><Transition name="popover"
                ><div
                  v-if="commandOpen"
                  ref="commandMenu"
                  class="command-menu floating-command-menu"
                  :style="commandMenuStyle"
                  role="menu"
                  aria-label="选择并执行命令"
                  @keydown="commandKeydown"
                >
                  <button
                    v-for="item in commands.filter(item => nativeAvailable || item.mode === 'run')"
                    :key="item.mode"
                    role="menuitem"
                    @click="
                      command = item.mode;
                      commandOpen = false;
                      run();
                    "
                  >
                    <div>
                      <span>{{ item.label }}</span
                      ><code>{{ item.hint }}</code>
                    </div>
                    <Check v-if="command === item.mode" :size="14" />
                  </button>
                  <p>Ctrl + Enter 重复运行</p>
                </div></Transition
              ></Teleport
            >
          </div>
        </div>
      </div>
      <div ref="panels" class="editor-panels" :style="panelStyle">
        <div class="editor-source" :style="sourceStyle">
          <div v-if="loading" class="editor-loading">
            <LoaderCircle class="spin" :size="18" />正在准备编辑器…
          </div>
          <div v-if="activeFile === 'toml'" class="manifest-hint">
            行尾勾选依赖，配置与语义索引自动更新。
          </div>
          <div ref="host" class="monaco-host" :class="{ compact }" />
        </div>
        <div
          class="editor-divider"
          role="separator"
          tabindex="0"
          :aria-orientation="layout === 'horizontal' ? 'vertical' : 'horizontal'"
          :aria-valuenow="Math.round(split * 100)"
          aria-valuemin="15"
          aria-valuemax="85"
          aria-label="调整编辑器与终端大小"
          @pointerdown="resizePanels"
          @keydown="resizeByKeyboard"
        />
        <div class="terminal-pane">
          <div class="terminal-header">
            <span><Terminal :size="15" />终端</span>
            <span class="terminal-state" role="status">
              <template v-if="busy"><LoaderCircle class="spin" :size="13" />执行中</template>
              <template v-else-if="result"
                ><Check v-if="result.success" :size="13" /><span>{{
                  result.success ? '已完成' : '执行失败'
                }}</span
                ><span class="terminal-duration"
                  >{{ (result.elapsed / 1000).toFixed(2) }}s</span
                ></template
              >
              <span v-else>等待运行</span>
            </span>
          </div>
          <TerminalView
            :text="liveText"
            :busy="busy"
            :status="nativeAvailable ? 'Cargo 正在执行…' : runtimeStatus"
            :error="error"
            :command="nativeAvailable ? 'cargo ' + command : 'rust-miri main.rs'"
            :result="result"
          />
        </div>
      </div>
      <div
        v-if="editorId !== 'playground' && !maximized"
        class="editor-height-handle"
        role="separator"
        tabindex="0"
        aria-orientation="horizontal"
        aria-label="调整编辑器整体高度"
        :aria-valuenow="totalHeight"
        aria-valuemin="260"
        aria-valuemax="12000"
        title="拖拽调整整体高度 · 双击恢复内容高度"
        @pointerdown="resizeTotalHeight"
        @keydown="resizeTotalByKeyboard"
        @dblclick="resetTotalHeight"
      /></div
  ></Teleport>
</template>
