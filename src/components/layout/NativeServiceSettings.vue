<script setup lang="ts">
import { Plug, LoaderCircle, X, Download, Copy, Check } from 'lucide-vue-next';
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
const address = ref(nativeServiceUrl.value || 'http://127.0.0.1:3000');
const mode = ref(nativeServiceUrl.value ? 'native' : 'browser');
const busy = ref(false);
const message = ref('');

const startupCommands = [
  { platform: 'Windows', command: '.\\rust-path-server.exe' },
  { platform: 'Linux', command: './rust-path-server' },
];

const selectedPlatform = ref(0);
const startupCommand = computed(() => startupCommands[selectedPlatform.value]!);
const copiedPlatform = ref('');
const copyError = ref('');
const reducedMotion = useReducedMotion();

const alreadyConnected = computed(() => {
  if (nativeConnectionStatus.value !== 'connected') {
    return false;
  }

  try {
    return new URL(address.value.trim()).href.replace(/\/+$/, '') === nativeServiceUrl.value;
  } catch {
    return false;
  }
});

const toolchainVersions = computed(() => {
  if (!nativeServiceUrl.value || nativeConnectionStatus.value !== 'connected') {
    return [];
  }

  return [
    { name: 'rust-analyzer', version: analyzerVersion.value },
    { name: 'Cargo', version: cargoVersion.value },
    { name: 'rustc', version: rustcVersion.value },
  ]
    .filter(entry => entry.version)
    .map(entry => ({
      ...entry,
      version: entry.version!.replace(new RegExp(`^${entry.name}\\s+`, 'i'), ''),
    }));
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
    address.value = nativeServiceUrl.value || 'http://127.0.0.1:3000';
    message.value = '';
    copiedPlatform.value = '';
    copyError.value = '';
  }
});

async function save() {
  if (busy.value || alreadyConnected.value) {
    return;
  }

  busy.value = true;
  message.value = '';

  try {
    configureNativeService(address.value);
    mode.value = nativeServiceUrl.value ? 'native' : 'browser';
    message.value = !nativeServiceUrl.value ? '已切换到浏览器模式' : '正在连接…';

    if (nativeServiceUrl.value) {
      message.value = (await detectNative())
        ? ''
        : '连接失败，请确认服务已启动，且地址与服务终端显示的一致。';
    }
  } catch (error) {
    message.value = error instanceof Error ? error.message : '配置保存失败';
  } finally {
    busy.value = false;
  }
}

function selectMode(value: 'browser' | 'native') {
  message.value = '';

  if (value === 'browser') {
    try {
      configureNativeService('');
    } catch (error) {
      message.value = error instanceof Error ? error.message : '配置保存失败';
      return;
    }
  }

  mode.value = value;
  address.value ||= 'http://127.0.0.1:3000';
}

function selectPlatform(index: number) {
  selectedPlatform.value = index;
  document.getElementById(`service-platform-${index}`)?.focus();
}

async function copyCommand(platform: string, command: string) {
  copyError.value = '';
  copiedPlatform.value = '';

  try {
    await navigator.clipboard.writeText(command);
    copiedPlatform.value = platform;
  } catch {
    copyError.value = '复制失败，请手动选择命令。';
  }
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
        <div
          class="service-mode-switch"
          :class="{ 'service-mode-enhanced': mode === 'native' }"
          role="group"
          aria-label="运行模式"
        >
          <button
            type="button"
            :aria-pressed="mode === 'browser'"
            :disabled="busy"
            @click="selectMode('browser')"
          >
            浏览器模式
          </button>
          <button
            type="button"
            :aria-pressed="mode === 'native'"
            :disabled="busy"
            @click="selectMode('native')"
          >
            Rust 增强服务
          </button>
        </div>
        <div class="service-mode-content">
          <motion.div
            :key="mode"
            :initial="{ opacity: reducedMotion ? 1 : 0 }"
            :animate="{ opacity: 1 }"
            :transition="{ duration: reducedMotion ? 0 : 0.08, ease: 'easeOut' }"
          >
            <p v-if="mode === 'browser'" class="service-intro">
              在浏览器中编译和运行 Rust，提供代码高亮、格式化与基础代码提示，无需安装。
            </p>
            <template v-else>
              <p class="service-intro">
                通过 Cargo
                运行、检查、构建和测试代码，支持课程依赖，并提供完整代码补全、悬浮说明与实时诊断。
              </p>
              <div v-if="nativeConnectionStatus !== 'connected'" class="service-instructions">
                <a
                  class="service-download"
                  href="https://github.com/YanChenBai/rust-path/releases/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download :size="14" />下载最新版本
                </a>
                <div class="service-command">
                  <div class="service-command-header">
                    <div class="service-platform-tabs" role="tablist" aria-label="操作系统">
                      <button
                        v-for="(entry, index) in startupCommands"
                        :id="`service-platform-${index}`"
                        :key="entry.platform"
                        type="button"
                        role="tab"
                        :aria-selected="selectedPlatform === index"
                        aria-controls="service-command-panel"
                        :tabindex="selectedPlatform === index ? 0 : -1"
                        @click="selectedPlatform = index"
                        @keydown.right.prevent="
                          selectPlatform((index + 1) % startupCommands.length)
                        "
                        @keydown.left.prevent="
                          selectPlatform(
                            (index + startupCommands.length - 1) % startupCommands.length,
                          )
                        "
                        @keydown.home.prevent="selectPlatform(0)"
                        @keydown.end.prevent="selectPlatform(startupCommands.length - 1)"
                      >
                        {{ entry.platform }}
                      </button>
                    </div>
                    <button
                      type="button"
                      :aria-label="`复制 ${startupCommand.platform} 启动命令`"
                      @click="copyCommand(startupCommand.platform, startupCommand.command)"
                    >
                      <Check v-if="copiedPlatform === startupCommand.platform" :size="13" />
                      <Copy v-else :size="13" />
                      {{ copiedPlatform === startupCommand.platform ? '已复制' : '复制' }}
                    </button>
                  </div>
                  <div
                    id="service-command-panel"
                    role="tabpanel"
                    :aria-labelledby="`service-platform-${selectedPlatform}`"
                    tabindex="0"
                  >
                    <code>{{ startupCommand.command }}</code>
                  </div>
                </div>
                <p class="service-hint">在下载目录运行命令，并保持终端开启。</p>
                <p v-if="copyError" role="status">{{ copyError }}</p>
              </div>
              <form @submit.prevent="save">
                <div class="service-address-label">
                  <label for="native-service-address">服务地址</label>
                  <span class="service-status" role="status">
                    <i class="service-dot" :class="nativeConnectionStatus" aria-hidden="true" />
                    {{ nativeConnectionStatus === 'browser' ? '尚未连接' : statusLabel }}
                  </span>
                </div>
                <input
                  id="native-service-address"
                  v-model="address"
                  type="url"
                  placeholder="http://127.0.0.1:3000"
                  autocomplete="off"
                  :disabled="busy"
                />
                <div class="native-service-buttons">
                  <button
                    type="submit"
                    class="service-connect"
                    :disabled="busy || alreadyConnected"
                  >
                    <LoaderCircle v-if="busy" :size="13" class="spin" />
                    <Check v-else-if="alreadyConnected" :size="13" />
                    {{ busy ? '连接中…' : alreadyConnected ? '已连接' : '保存并连接' }}
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
                  :transition="{ duration: reducedMotion ? 0 : 0.18, ease: 'easeOut' }"
                >
                  <div class="service-versions-spacing">
                    <dl class="service-versions-content" aria-label="工具链版本">
                      <div v-for="entry in toolchainVersions" :key="entry.name">
                        <dt>{{ entry.name }}</dt>
                        <dd>{{ entry.version }}</dd>
                      </div>
                    </dl>
                  </div>
                </motion.div>
              </AnimatePresence>
            </template>
          </motion.div>
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
.service-versions-spacing {
  padding-top: 18px;
}
.service-versions-content {
  display: grid;
  gap: 8px;
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
}
.service-versions-content div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
}
.service-versions-content dt {
  flex-shrink: 0;
  color: #ddd;
  font-weight: 600;
}
.service-versions-content dd {
  min-width: 0;
  margin: 0;
  color: #aaa;
  font-family: inherit;
  text-align: right;
  overflow-wrap: anywhere;
}
.service-address-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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
  grid-template-columns: minmax(0, 1fr);
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
.service-mode-switch {
  position: relative;
  isolation: isolate;
  display: flex;
  gap: 3px;
  margin: 16px 0 0;
  padding: 3px;
  border-radius: 6px;
  background: #111;
}
.service-mode-switch::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 3px auto 3px 3px;
  width: calc((100% - 9px) / 2);
  border-radius: 4px;
  background: #303030;
  transition: transform 100ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.service-mode-switch.service-mode-enhanced::before {
  transform: translateX(calc(100% + 3px));
}
.service-mode-switch button {
  flex: 1;
  min-width: 0;
  padding: 8px 12px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #999;
  font-size: 12px;
  cursor: pointer;
}
.service-mode-switch button[aria-pressed='true'] {
  color: #eee;
}
.service-mode-content {
  padding-top: 16px;
  overflow: hidden;
}
.service-mode-content .service-intro:last-child {
  margin-bottom: 0;
}
@media (prefers-reduced-motion: reduce) {
  .service-mode-switch::before {
    transition: none;
  }
}
.native-service-settings .service-message {
  margin: 14px 0 0;
}
.service-instructions {
  margin-bottom: 20px;
}
.native-service-settings .service-hint {
  margin: 8px 0 0;
  font-size: 11px;
}
.service-download {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #bbb;
  text-decoration: none;
}
.service-download:hover {
  text-decoration: underline;
  color: #fff;
}
.service-command {
  margin-top: 12px;
}
.service-command-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.service-command-header button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 6px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #aaa;
  font-size: 11px;
  cursor: pointer;
}
.service-command-header button:hover {
  background: #303030;
  color: #eee;
}
.service-platform-tabs {
  display: flex;
  gap: 4px;
}
.service-platform-tabs button {
  border-radius: 0;
  border-bottom: 1px solid transparent;
}
.service-platform-tabs button[aria-selected='true'] {
  border-bottom-color: #aaa;
  color: #eee;
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
  .service-dot.connecting {
    animation: none;
  }
}
</style>
