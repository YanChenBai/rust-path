import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';

import { progress } from '../progress';
import { locateAnnotation, type TextAnnotation } from '../runtime/text-annotations';

const ignored =
  '.code-editor, .code-snippet, button, textarea, [data-annotation-anchor], script, style';

function textIndex(root: HTMLElement) {
  const nodes: { node: Text; start: number; end: number }[] = [];
  let text = '';
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    if (node.textContent && !node.parentElement?.closest(ignored)) {
      const start = text.length;
      text += node.textContent;
      nodes.push({ node: node as Text, start, end: text.length });
    }

    node = walker.nextNode();
  }

  return { text, nodes };
}

export function useTextAnnotations(root: () => HTMLElement | undefined, lessonId: () => string) {
  const selection = shallowRef<{
    anchor: Omit<TextAnnotation, 'id' | 'body' | 'createdAt'>;
    range: Range;
  }>();

  const selectionStyle = ref({ left: '0px', top: '0px' });
  const markers = shallowRef<{ annotation: TextAnnotation; element: HTMLElement }[]>([]);
  const annotations = computed(() => progress.annotations[lessonId()] ?? []);
  let observer: MutationObserver | undefined;
  let scheduled = 0;

  function placeSelection() {
    const bounds = selection.value?.range.getClientRects();
    const last = bounds?.[bounds.length - 1];

    if (last) {
      selectionStyle.value = {
        left: `${Math.min(innerWidth - 136, Math.max(8, last.right + 4))}px`,
        top: `${Math.min(innerHeight - 44, last.bottom + 6)}px`,
      };
    }
  }

  function captureSelection() {
    const container = root();
    const selected = window.getSelection();

    if (!container || !selected?.rangeCount || selected.isCollapsed) {
      selection.value = undefined;
      return;
    }

    const range = selected.getRangeAt(0);

    if (
      !container.contains(range.startContainer) ||
      !container.contains(range.endContainer) ||
      range.startContainer.parentElement?.closest(ignored) ||
      range.endContainer.parentElement?.closest(ignored)
    ) {
      selection.value = undefined;
      return;
    }

    const { text, nodes } = textIndex(container);
    const selectedNodes = nodes.filter(item => range.intersectsNode(item.node));
    const first = selectedNodes[0];
    const last = selectedNodes.at(-1);

    if (!first || !last) {
      return;
    }

    let start = first.start + (range.startContainer === first.node ? range.startOffset : 0);
    let end = last.start + (range.endContainer === last.node ? range.endOffset : last.node.length);
    const raw = text.slice(start, end);
    start += raw.length - raw.trimStart().length;
    end -= raw.length - raw.trimEnd().length;
    const quote = text.slice(start, end);

    if (!quote || quote.length > 2000) {
      selection.value = undefined;
      return;
    }

    selection.value = {
      anchor: {
        quote,
        start,
        end,
        prefix: text.slice(Math.max(0, start - 48), start),
        suffix: text.slice(end, end + 48),
      },
      range: range.cloneRange(),
    };
    placeSelection();
  }

  function synchronize() {
    const container = root();
    observer?.disconnect();

    if (!container) {
      markers.value = [];
      return;
    }

    container.querySelectorAll('[data-annotation-anchor]').forEach(element => element.remove());
    const { text, nodes } = textIndex(container);
    const next: typeof markers.value = [];

    const located = annotations.value
      .map(annotation => ({ annotation, match: locateAnnotation(text, annotation) }))
      .sort((a, b) => (b.match?.end ?? 0) - (a.match?.end ?? 0));

    // 从后向前插入，避免拆分同一文本节点后使后续偏移失效。
    for (const { annotation, match } of located) {
      const entry = match && nodes.find(item => item.start < match.end && item.end >= match.end);

      if (!match || !entry) {
        continue;
      }

      const range = document.createRange();
      range.setStart(entry.node, match.end - entry.start);
      range.collapse(true);
      const element = document.createElement('span');
      element.dataset.annotationAnchor = annotation.id;
      element.className = 'annotation-anchor';
      range.insertNode(element);
      next.push({ annotation, element });
    }

    markers.value = next;
    observer?.observe(container, { childList: true, subtree: true, characterData: true });
  }

  function schedule() {
    cancelAnimationFrame(scheduled);
    scheduled = requestAnimationFrame(synchronize);
  }

  watch(
    [root, lessonId, annotations],
    async () => {
      selection.value = undefined;
      await nextTick();
      schedule();
    },
    { deep: true, flush: 'post' },
  );
  onMounted(() => {
    observer = new MutationObserver(records => {
      if (
        records.some(
          record =>
            !(
              record.target instanceof Element ? record.target : record.target.parentElement
            )?.closest(ignored),
        )
      ) {
        schedule();
      }
    });
    schedule();
    document.addEventListener('selectionchange', captureSelection);
    window.addEventListener('scroll', placeSelection, true);
    window.addEventListener('resize', placeSelection);
  });
  onBeforeUnmount(() => {
    observer?.disconnect();
    cancelAnimationFrame(scheduled);
    document.removeEventListener('selectionchange', captureSelection);
    window.removeEventListener('scroll', placeSelection, true);
    window.removeEventListener('resize', placeSelection);
    root()
      ?.querySelectorAll('[data-annotation-anchor]')
      .forEach(element => element.remove());
  });

  return { selection, selectionStyle, markers };
}
