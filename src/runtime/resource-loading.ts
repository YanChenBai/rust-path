import { reactive } from 'vue';

export type ResourceKind = 'runtime' | 'editor' | 'language';

interface ResourceTask {
  kind: ResourceKind;
  label: string;
  status: 'loading' | 'ready' | 'error';
  completed: number;
  total: number | null;
  visible: boolean;
}

export const resourceTasks = reactive(new Map<symbol, ResourceTask>());

// 每个编辑器拥有独立任务，卸载时删除，避免并行初始化互相覆盖。
export function beginResourceLoading(
  kind: ResourceKind,
  label: string,
  total: number | null = null,
) {
  const id = Symbol(label);

  const task = reactive<ResourceTask>({
    kind,
    label,
    status: 'loading',
    completed: 0,
    total,
    visible: false,
  });

  let shownAt = 0;
  let hideTimer: ReturnType<typeof setTimeout> | undefined;

  // 快速完成的资源不显示；已经出现的指示保留至少 350ms，避免闪烁。
  const showTimer = setTimeout(() => {
    shownAt = Date.now();
    task.visible = true;
  }, 200);

  resourceTasks.set(id, task);

  return {
    progress(completed: number, total: number) {
      task.completed = Math.max(0, Math.min(completed, total));
      task.total = total > 0 ? total : null;
    },
    stage(label: string) {
      task.label = label;
      task.total = null;
    },
    ready(label: string) {
      clearTimeout(showTimer);
      task.label = label;
      task.status = 'ready';
      clearTimeout(hideTimer);

      if (task.visible) {
        hideTimer = setTimeout(
          () => {
            task.visible = false;
          },
          Math.max(0, 350 - (Date.now() - shownAt)),
        );
      }
    },
    fail(label: string) {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      task.label = label;
      task.status = 'error';
      task.visible = true;
    },
    dispose() {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      resourceTasks.delete(id);
    },
  };
}
