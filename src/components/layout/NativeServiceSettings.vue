<script setup lang="ts">
import { Plug, LoaderCircle, X, ChevronDown } from 'lucide-vue-next';
import { AnimatePresence, motion, useReducedMotion } from 'motion-v';
import { computed, ref, watch } from 'vue';

import { useFloatingMenu } from '../../composables/useFloatingMenu';
import {
  analyzerVersion,
  cargoVersion,
  configureNativeService,
  detectNative,
  nativeConnectionStatus,
  nativeServiceUrl,
  rustcVersion,
} from '../../runtime/native';

const { open, anchor, menu, style, close } = useFloatingMenu();
const address = ref(nativeServiceUrl.value);
const busy = ref(false);
const message = ref('');
const origin = location.origin;
const showInstructions = ref(false);
const reducedMotion = useReducedMotion();

const toolchainVersions = computed(() => {
  if (!nativeServiceUrl.value || nativeConnectionStatus.value !== 'connected') {
    return [];
  }

  return [
    { name: 'rust-analyzer', version: analyzerVersion.value },
    { name: 'Cargo', version: cargoVersion.value },
    { name: 'rustc', version: rustcVersion.value },
  ].filter(entry => entry.version);
});

const statusLabel = computed(
  () =>
    ({
      browser: '浏览器模式',
      disconnected: '尚未连接',
      connecting: '正在连接',
      connected: '已连接',
      error: '连接失败',
    })[nativeConnectionStatus.value],
);

watch(open, value => {
  if (value) {
    address.value = nativeServiceUrl.value;
    message.value = '';
  }
});

async function save() {
  busy.value = true;
  message.value = '';

  try {
    configureNativeService(address.value);
    message.value = !nativeServiceUrl.value ? '已切换到浏览器模式' : '正在连接…';

    if (nativeServiceUrl.value) {
      message.value = (await detectNative())
        ? '已连接本机增强服务'
        : '连接失败，当前使用浏览器模式。请检查服务地址与来源授权。';
    }
  } catch (error) {
    message.value = error instanceof Error ? error.message : '配置保存失败';
  } finally {
    busy.value = false;
  }
}

async function browserMode() {
  address.value = '';
  await save();
}
</script>

<template>
  <div ref="anchor" class="native-service-anchor">
    <button
      class="icon-button"
      :aria-label="`Rust 服务设置 · ${statusLabel}`"
      :title="`Rust Service · ${statusLabel}`"
      :aria-expanded="open"
      @click="open = !open"
    >
      <Plug :size="17" />
      <i class="service-dot" :class="nativeConnectionStatus" aria-hidden="true" />
    </button>
  </div>
  <Teleport to="body">
    <Transition name="service-popover">
      <section
        v-if="open"
        ref="menu"
        class="native-service-settings"
        :style="style"
        role="dialog"
        aria-label="Rust 服务设置"
        @keydown.esc.stop="close(true)"
      >
        <header>
          <strong>Rust Service</strong>
          <button class="icon-button" aria-label="关闭服务设置" @click="close(true)">
            <X :size="15" />
          </button>
        </header>
        <div class="service-status">
          <i class="service-dot" :class="nativeConnectionStatus" aria-hidden="true" /><span>{{
            statusLabel
          }}</span>
        </div>
        <p class="service-intro">
          连接本机服务，启用 Cargo 与完整代码补全。<br />不配置时直接使用浏览器运行。
        </p>
        <form @submit.prevent="save">
          <label for="native-service-address">服务地址</label>
          <input
            id="native-service-address"
            v-model="address"
            type="url"
            placeholder="http://127.0.0.1:3000"
            autocomplete="off"
            :disabled="busy"
          />
          <small>仅保存在当前浏览器，留空可关闭连接。</small>
          <div class="native-service-buttons">
            <button type="submit" class="service-connect" :disabled="busy">
              <LoaderCircle v-if="busy" :size="13" class="spin" />{{
                busy ? '连接中…' : '保存并连接'
              }}
            </button>
            <button type="button" class="service-browser" :disabled="busy" @click="browserMode">
              浏览器模式
            </button>
          </div>
        </form>
        <p v-if="message" class="service-message" role="status">{{ message }}</p>
        <AnimatePresence>
          <motion.div
            v-if="toolchainVersions.length"
            class="service-versions"
            :initial="reducedMotion ? false : { height: 0, opacity: 0 }"
            :animate="{ height: 'auto', opacity: 1 }"
            :exit="{ height: 0, opacity: 0 }"
            :transition="{ duration: reducedMotion ? 0 : 0.1, ease: 'easeOut' }"
          >
            <dl class="service-versions-content" aria-label="工具链版本">
              <div v-for="entry in toolchainVersions" :key="entry.name">
                <dt class="sr-only">{{ entry.name }}</dt>
                <dd>{{ entry.version }}</dd>
              </div>
            </dl>
          </motion.div>
        </AnimatePresence>
        <div class="service-instructions">
          <button
            type="button"
            class="service-instructions-toggle"
            :aria-expanded="showInstructions"
            @click="showInstructions = !showInstructions"
          >
            如何连接独立服务<ChevronDown :size="13" :class="{ expanded: showInstructions }" />
          </button>
          <AnimatePresence>
            <motion.div
              v-if="showInstructions"
              class="service-instructions-content"
              :initial="reducedMotion ? false : { height: 0, opacity: 0 }"
              :animate="{ height: 'auto', opacity: 1 }"
              :exit="{ height: 0, opacity: 0 }"
              :transition="{ duration: reducedMotion ? 0 : 0.1, ease: 'easeOut' }"
            >
              <p>启动时允许当前网页访问：</p>
              <code>rust-path-server.exe --origin {{ origin }}</code>
              <p>本地开发可运行 vp run dev:server -- --origin {{ origin }}。</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </Transition>
  </Teleport>
</template>

<style scoped>
.service-popover-enter-active {
  transition:
    opacity 100ms ease-out,
    transform 100ms ease-out;
}
.service-popover-leave-active {
  transition: opacity 80ms ease-in;
}
.service-popover-enter-from {
  opacity: 0;
  transform: translateY(-3px);
}
.service-popover-leave-to {
  opacity: 0;
}
.native-service-settings {
  position: fixed;
  z-index: 1100;
  width: min(360px, calc(100vw - 16px));
  padding: 20px;
  border: 1px solid #333;
  border-radius: 10px;
  background: #181818;
  box-shadow: 0 12px 40px #0006;
  color: #ddd;
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  overflow: auto;
}
.native-service-settings header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.native-service-settings header {
  justify-content: space-between;
  margin-bottom: 8px;
}
.native-service-settings header strong {
  font-size: 14px;
  font-weight: 600;
}
.native-service-settings .service-intro {
  margin: 12px 0 20px;
}
.native-service-settings p,
.native-service-settings small,
.service-instructions {
  color: #969696;
  font-size: 12px;
  line-height: 1.7;
}
.service-versions {
  overflow: hidden;
}
.service-versions-content {
  display: grid;
  gap: 8px;
  margin: 18px 0 0;
  padding-top: 14px;
  border-top: 1px solid #303030;
  font-size: 12px;
  line-height: 1.6;
}
.service-versions-content div {
  min-width: 0;
}
.service-versions-content dd {
  margin: 0;
  color: #ddd;
  font-family: inherit;
  text-align: left;
  overflow-wrap: anywhere;
}
.native-service-settings form {
  display: grid;
  gap: 8px;
}
.native-service-settings label {
  font-size: 12px;
  font-weight: 500;
}
.native-service-settings input {
  min-width: 0;
  width: 100%;
  height: 38px;
  padding: 9px 10px;
  border: 1px solid #444;
  border-radius: 6px;
  background: #111;
  color: #eee;
  font-size: 13px;
  font-weight: 400;
}
.native-service-settings small {
  font-size: 11px;
}
.native-service-buttons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 10px;
  gap: 8px;
}
.native-service-buttons button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 34px;
  padding: 0 13px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 500;
}
.service-connect {
  background: #303030;
  color: #eee;
  border: 1px solid #505050;
}
.service-connect:hover {
  background: #393939;
}
.service-browser {
  background: transparent;
  border: 1px solid #333;
  color: #aaa;
}
.service-browser:hover {
  color: #eee;
}
.native-service-settings .service-message {
  margin: 14px 0 0;
}
.service-instructions {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid #303030;
}
.service-instructions-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: #aaa;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.7;
  cursor: pointer;
}
.service-instructions-toggle svg {
  transition: transform 100ms ease-out;
}
.service-instructions-toggle svg.expanded {
  transform: rotate(180deg);
}
.service-instructions-content {
  overflow: hidden;
}
.service-instructions-content p {
  margin: 10px 0;
}
.native-service-settings code {
  display: block;
  overflow-wrap: anywhere;
  font-size: 11px;
  color: #ddd;
  padding: 10px;
  border-radius: 5px;
  background: #111;
  font-weight: 400;
  line-height: 1.7;
}
.native-service-anchor button {
  position: relative;
}
.service-dot {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #777;
  flex-shrink: 0;
}
.native-service-anchor .service-dot {
  position: absolute;
  right: 4px;
  bottom: 4px;
  box-shadow: 0 0 0 2px #141414;
}
.service-dot.connected {
  background: #8ac294;
}
.service-dot.connecting {
  background: #d8b469;
  animation: service-pulse 1s ease-in-out infinite alternate;
}
.service-dot.error {
  background: #e3887d;
}
.service-status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #999;
  font-size: 11px;
}
@keyframes service-pulse {
  to {
    opacity: 0.35;
  }
}
@media (prefers-reduced-motion: reduce) {
  .service-popover-enter-active,
  .service-popover-leave-active {
    transition: none;
  }
  .service-instructions-toggle svg {
    transition: none;
  }
  .service-dot.connecting {
    animation: none;
  }
}
</style>
