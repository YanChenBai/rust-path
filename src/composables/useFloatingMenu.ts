import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

export function useFloatingMenu(options: { align?: 'start' | 'end'; offset?: number } = {}) {
  const open = ref(false);
  const anchor = ref<HTMLElement>();
  const menu = ref<HTMLElement>();
  const position = ref({ left: 0, top: 0, maxHeight: 400 });

  const style = computed(() => ({
    left: `${position.value.left}px`,
    top: `${position.value.top}px`,
    maxHeight: `${position.value.maxHeight}px`,
  }));

  function reposition() {
    if (!open.value || !anchor.value || !menu.value) {
      return;
    }

    const bounds = anchor.value.getBoundingClientRect();
    const width = menu.value.offsetWidth;
    const height = menu.value.scrollHeight;
    const offset = options.offset ?? 6;
    const below = innerHeight - bounds.bottom - offset - 10;
    const above = bounds.top - offset - 10;
    const flip = below < height && above > below;
    const maxHeight = Math.max(100, flip ? above : below);
    position.value = {
      left: Math.max(
        8,
        Math.min(
          options.align === 'start' ? bounds.left : bounds.right - width,
          innerWidth - width - 8,
        ),
      ),
      top: flip
        ? Math.max(8, bounds.top - Math.min(height, maxHeight) - offset)
        : bounds.bottom + offset,
      maxHeight,
    };
  }

  function close(restoreFocus = false) {
    open.value = false;

    if (restoreFocus) {
      anchor.value?.querySelector('button')?.focus();
    }
  }

  function outside(event: PointerEvent) {
    if (
      !anchor.value?.contains(event.target as Node) &&
      !menu.value?.contains(event.target as Node)
    ) {
      close();
    }
  }

  function keydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
      return;
    }

    const items = [...(menu.value?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])];
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    const direction = { ArrowDown: 1, ArrowUp: -1 }[event.key];

    if (direction) {
      event.preventDefault();
      items[(current + direction + items.length) % items.length]?.focus();
    }
  }

  watch(open, async value => {
    if (!value) {
      return;
    }

    await nextTick();
    reposition();
    menu.value?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
  });
  onMounted(() => {
    window.addEventListener('pointerdown', outside);
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('pointerdown', outside);
    window.removeEventListener('scroll', reposition, true);
    window.removeEventListener('resize', reposition);
  });

  return { open, anchor, menu, style, keydown, close };
}
