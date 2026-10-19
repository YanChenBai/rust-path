import { computed, ref, onBeforeUnmount, type Ref } from 'vue';

import { progress } from '../progress';

export function useEditorPanels(
  props: { editorId: string; initialCode: string },
  layout: Ref<'vertical' | 'horizontal'>,
  maximized: Ref<boolean>,
) {
  const panels = ref<HTMLElement>();
  const contentHeight = ref(Math.max(4, props.initialCode.trimEnd().split('\n').length) * 25 + 20);
  const manualResize = ref(false);
  const frozenHeight = ref(0);
  const headerAndHandle = 46;

  const defaultSplit = computed(() => ({
    vertical: contentHeight.value / (contentHeight.value + 166),
    horizontal: 0.64,
  }));

  const panelStyle = computed(() =>
    props.editorId === 'playground' || maximized.value
      ? {}
      : {
          height: `${panelHeight.value}px`,
        },
  );

  const split = computed({
    get: () => (progress.editorSplits[props.editorId] ?? defaultSplit.value)[layout.value],
    set: value => {
      frozenHeight.value = panels.value?.clientHeight ?? naturalHeight.value;
      manualResize.value = true;
      const previous = progress.editorSplits[props.editorId] ?? defaultSplit.value;
      progress.editorSplits[props.editorId] = { ...previous, [layout.value]: value };
    },
  });

  const naturalHeight = computed(() =>
    layout.value === 'vertical'
      ? Math.ceil(contentHeight.value / split.value) + 6
      : Math.max(contentHeight.value, 180),
  );

  const panelHeight = computed(() => {
    const saved = progress.editorHeights[props.editorId];

    if (saved) {
      return saved - headerAndHandle;
    }

    return manualResize.value && layout.value === 'vertical'
      ? frozenHeight.value
      : naturalHeight.value;
  });

  const totalHeight = computed(() => Math.round(panelHeight.value + headerAndHandle));

  function setTotalHeight(value: number) {
    progress.editorHeights[props.editorId] = Math.max(260, Math.min(12000, Math.round(value)));
  }

  function resetTotalHeight() {
    delete progress.editorHeights[props.editorId];
    manualResize.value = false;
  }

  function resizeTotalHeight(event: PointerEvent) {
    event.preventDefault();
    stopResize?.();
    const initialY = event.clientY;
    const initialHeight = totalHeight.value;

    const move = (point: PointerEvent) => setTotalHeight(initialHeight + point.clientY - initialY);

    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
      stopResize = undefined;
    };

    stopResize = stop;
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop, { once: true });
    window.addEventListener('pointercancel', stop, { once: true });
  }

  function resizeTotalByKeyboard(event: KeyboardEvent) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
      return;
    }

    event.preventDefault();
    setTotalHeight(totalHeight.value + (event.key === 'ArrowUp' ? -40 : 40));
  }

  function updateContentHeight(height: number) {
    contentHeight.value = Math.max(120, Math.ceil(height));
  }

  const sourceStyle = computed(() => ({
    flexBasis: `${split.value * 100}%`,
    flexGrow: 0,
    flexShrink: 0,
  }));

  let stopResize: (() => void) | undefined;

  function resizePanels(event: PointerEvent) {
    if (!panels.value) {
      return;
    }

    event.preventDefault();

    const bounds = panels.value.getBoundingClientRect();
    const horizontal = layout.value === 'horizontal';

    const move = (point: PointerEvent) => {
      const ratio = horizontal
        ? (point.clientX - bounds.left) / bounds.width
        : (point.clientY - bounds.top) / bounds.height;

      split.value = Math.max(0.15, Math.min(0.85, ratio));
    };

    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      stopResize = undefined;
    };

    stopResize = stop;
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop, { once: true });
  }

  function resizeByKeyboard(event: KeyboardEvent) {
    const deltas: Record<string, number> = {
      ArrowLeft: -0.03,
      ArrowUp: -0.03,
      ArrowRight: 0.03,
      ArrowDown: 0.03,
    };

    const delta = deltas[event.key];

    if (delta) {
      event.preventDefault();
      split.value = Math.max(0.15, Math.min(0.85, split.value + delta));
    }
  }

  onBeforeUnmount(() => stopResize?.());
  return {
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
  };
}
