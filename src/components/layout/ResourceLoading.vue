<script setup lang="ts">
import { AlertCircle, Check } from 'lucide-vue-next';
import { AnimatePresence, motion, useReducedMotion } from 'motion-v';
import { computed } from 'vue';

import { resourceTasks, type ResourceKind } from '../../runtime/resource-loading';

const groups: { kind: ResourceKind; label: string }[] = [
  { kind: 'runtime', label: 'Rust Engine' },
  { kind: 'editor', label: 'Code Tools' },
  { kind: 'language', label: 'Rust Analyzer' },
];

const reducedMotion = useReducedMotion();

const resources = computed(() =>
  groups
    .map(group => {
      const tasks = [...resourceTasks.values()].filter(
        task => task.kind === group.kind && task.visible,
      );

      const loading = tasks.filter(task => task.status === 'loading');
      const failed = tasks.some(task => task.status === 'error');
      const indeterminate = loading.some(task => task.total === null);
      const measured = loading.filter(task => task.total !== null);
      const completed = measured.reduce((sum, task) => sum + task.completed, 0);
      const total = measured.reduce((sum, task) => sum + (task.total ?? 0), 0);
      const percent = total ? Math.floor((completed / total) * 100) : 100;
      let status = tasks.length ? 'ready' : 'idle';

      if (loading.length) {
        status = 'loading';
      } else if (failed) {
        status = 'error';
      }

      const details = tasks.map(task => {
        const count =
          task.status === 'loading' && task.total ? ` ${task.completed}/${task.total}` : '';

        return `${task.label}${count}`;
      });

      return {
        ...group,
        status,
        percent,
        indeterminate,
        stage: group.kind === 'language' ? loading[0]?.label : undefined,
        description: `${group.label}：${details.join('；') || '按需加载'}`,
      };
    })
    .filter(resource => resource.status !== 'idle'),
);
</script>

<template>
  <AnimatePresence>
    <motion.div
      v-for="resource in resources"
      :key="resource.kind"
      class="resource-loading"
      :initial="reducedMotion ? false : { width: 0, opacity: 0 }"
      :animate="{ width: 'auto', opacity: 1 }"
      :exit="{ width: 0, opacity: 0 }"
      :transition="{ duration: reducedMotion ? 0 : 0.24, ease: 'easeOut' }"
    >
      <div class="resource-indicator" :class="resource.status" :title="resource.description">
        <span
          class="resource-ring"
          :class="{ indeterminate: resource.status === 'loading' && resource.indeterminate }"
          :role="resource.status === 'loading' ? 'progressbar' : 'status'"
          :aria-label="resource.label"
          :aria-valuemin="resource.status === 'loading' ? 0 : undefined"
          :aria-valuemax="resource.status === 'loading' ? 100 : undefined"
          :aria-valuenow="
            resource.status === 'loading' && !resource.indeterminate ? resource.percent : undefined
          "
          :aria-valuetext="resource.description"
        >
          <svg viewBox="0 0 28 28" aria-hidden="true">
            <circle class="resource-ring-track" cx="14" cy="14" r="11" />
            <circle
              v-if="resource.status !== 'error'"
              class="resource-ring-value"
              cx="14"
              cy="14"
              r="11"
              pathLength="100"
              :stroke-dasharray="resource.indeterminate ? '25 75' : '100 100'"
              :stroke-dashoffset="resource.indeterminate ? 0 : 100 - resource.percent"
            />
          </svg>
          <AlertCircle v-if="resource.status === 'error'" :size="13" aria-hidden="true" />
          <Check v-else-if="resource.status === 'ready'" :size="12" aria-hidden="true" />
          <small v-else-if="!resource.indeterminate">{{ resource.percent }}</small>
        </span>
        <span class="resource-label">{{ resource.label }}</span>
        <span v-if="resource.stage" class="resource-stage">{{ resource.stage }}</span>
      </div>
    </motion.div>
  </AnimatePresence>
</template>

<style scoped>
.resource-loading {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  overflow: hidden;
}
.resource-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #999;
  font-size: 10px;
  white-space: nowrap;
}
.resource-indicator.loading {
  color: #dedede;
}
.resource-indicator.error {
  color: #e6a18e;
}
.resource-ring {
  position: relative;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}
.resource-stage {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #999;
}
.resource-ring > svg:first-child {
  position: absolute;
  inset: 0;
  width: 28px;
  height: 28px;
  transform: rotate(-90deg);
  fill: none;
  stroke-width: 1.7;
}
.resource-ring-track {
  stroke: #393939;
}
.resource-ring-value {
  stroke: currentColor;
  stroke-linecap: round;
  transition: stroke-dashoffset 180ms ease;
}
.resource-ring small {
  font-size: 8px;
  font-variant-numeric: tabular-nums;
}
.resource-ring.indeterminate > svg:first-child {
  animation: resource-spin 1.2s linear infinite;
}
@keyframes resource-spin {
  to {
    transform: rotate(270deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .resource-ring.indeterminate > svg:first-child {
    animation: none;
  }
  .resource-ring-value {
    transition: none;
  }
}
@media (max-width: 640px) {
  .resource-label {
    display: none;
  }
  .resource-stage {
    display: none;
  }
}
</style>
