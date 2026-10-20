<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import shader from './landing-particles.wgsl?raw';

const gpuCanvas = ref<HTMLCanvasElement>();
const fallbackCanvas = ref<HTMLCanvasElement>();
const isGpuReady = ref(false);
let dispose: (() => void) | undefined;

onMounted(() => {
  const gpuElement = gpuCanvas.value!;
  const fallbackElement = fallbackCanvas.value!;
  const context = fallbackElement.getContext('2d');
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = { x: 0, y: 0 };
  let device: GPUDevice | undefined;
  let gpuContext: GPUCanvasContext | null = null;
  let pipeline: GPURenderPipeline | undefined;
  let uniforms: GPUBuffer | undefined;
  let bindings: GPUBindGroup | undefined;
  let frame = 0;
  let isDisposed = false;
  let elapsed = 0;
  let previousTime = 0;
  let width = 1;
  let height = 1;
  const uniformData = new Float32Array(8);

  function drawFallback(time: number) {
    if (!context) {
      return;
    }

    context.clearRect(0, 0, width, height);
    const phase = time * 0.22;

    for (let column = 0; column < 90; column++) {
      for (let row = 0; row < 60; row++) {
        const x = (column / 89 - 0.5) * 4.8;
        const z = (row / 59 - 0.5) * 3.2;

        const wave =
          Math.sin(x * 1.6 + z * 1.2 + phase) * 0.38 +
          Math.cos(z * 2.4 - x * 0.65 + phase * 0.7) * 0.24;

        const horizontal = 0.54 + (x + z * 0.32) * 0.18 + pointer.x * 0.012;
        const vertical = 0.51 + z * 0.17 - wave * 0.25 + pointer.y * 0.008;
        const edge = Math.sin((column / 89) * Math.PI) ** 2 * Math.sin((row / 59) * Math.PI) ** 2;
        const radius = (1.05 + (z + 1.6) * 0.18) * Math.min(width / 900, 1.5);
        context.fillStyle = `rgba(255, 255, 255, ${edge * (0.18 + (wave + 0.62) * 0.37)})`;
        context.beginPath();
        context.arc(horizontal * width, vertical * height, radius * 0.7, 0, Math.PI * 2);
        context.fill();
      }
    }
  }

  function draw(time: number) {
    if (!isGpuReady.value || !device || !pipeline || !uniforms || !bindings || !gpuContext) {
      drawFallback(time);
      return;
    }

    uniformData.set([width, height, time, 0, pointer.x, pointer.y, 0, 0]);
    device.queue.writeBuffer(uniforms, 0, uniformData);
    const encoder = device.createCommandEncoder();

    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: gpuContext.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    });

    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindings);
    pass.draw(6, 5400);
    pass.end();
    device.queue.submit([encoder.finish()]);
  }

  function animate(now: number) {
    frame = 0;

    if (isDisposed || document.hidden) {
      return;
    }

    if (now - previousTime >= 1000 / 30) {
      elapsed += previousTime ? Math.min((now - previousTime) / 1000, 0.1) : 0;
      previousTime = now;
      draw(motionPreference.matches ? 0 : elapsed);
    }

    if (!motionPreference.matches) {
      frame = requestAnimationFrame(animate);
    }
  }

  function resume() {
    cancelAnimationFrame(frame);
    previousTime = 0;

    if (!isDisposed && !document.hidden) {
      draw(motionPreference.matches ? 0 : elapsed);

      if (!motionPreference.matches) {
        frame = requestAnimationFrame(animate);
      }
    }
  }

  function resize() {
    const bounds = fallbackElement.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    width = Math.max(1, Math.round(bounds.width * ratio));
    height = Math.max(1, Math.round(bounds.height * ratio));
    gpuElement.width = fallbackElement.width = width;
    gpuElement.height = fallbackElement.height = height;
    draw(motionPreference.matches ? 0 : elapsed);
  }

  function move(event: PointerEvent) {
    if (!motionPreference.matches) {
      pointer.x = (event.clientX / innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / innerHeight - 0.5) * 2;
    }
  }

  function resetPointer() {
    pointer.x = 0;
    pointer.y = 0;
  }

  async function initializeGpu() {
    if (!navigator.gpu) {
      return;
    }

    try {
      const adapter = await navigator.gpu.requestAdapter();

      if (!adapter || isDisposed) {
        return;
      }

      const nextDevice = await adapter.requestDevice();

      if (isDisposed) {
        nextDevice.destroy();
        return;
      }

      device = nextDevice;
      void device.lost.then(() => {
        isGpuReady.value = false;

        if (!isDisposed) {
          drawFallback(motionPreference.matches ? 0 : elapsed);
          resume();
        }
      });
      gpuContext = gpuElement.getContext('webgpu') as GPUCanvasContext | null;

      if (!gpuContext) {
        device.destroy();
        return;
      }

      const format = navigator.gpu.getPreferredCanvasFormat();
      gpuContext.configure({ device, format, alphaMode: 'premultiplied' });
      const module = device.createShaderModule({ code: shader });
      pipeline = await device.createRenderPipelineAsync({
        layout: 'auto',
        vertex: { module, entryPoint: 'vertex' },
        fragment: {
          module,
          entryPoint: 'fragment',
          targets: [
            {
              format,
              blend: {
                color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' },
                alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' },
              },
            },
          ],
        },
        primitive: { topology: 'triangle-list' },
      });

      if (isDisposed) {
        return;
      }

      uniforms = device.createBuffer({
        size: 32,
        // WebGPU 的 UNIFORM (0x40) 与 COPY_DST (0x08) 标志。
        usage: 0x40 | 0x08,
      });
      bindings = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: uniforms } }],
      });
      isGpuReady.value = true;
      resume();
    } catch {
      // 设备不可用或着色器初始化失败时，继续用 Canvas 绘制点阵。
      isGpuReady.value = false;
      device?.destroy();
    }
  }

  const observer = new ResizeObserver(resize);
  observer.observe(fallbackElement);
  window.addEventListener('pointermove', move, { passive: true });
  document.documentElement.addEventListener('pointerleave', resetPointer);
  document.addEventListener('visibilitychange', resume);
  motionPreference.addEventListener('change', resume);
  resize();
  resume();
  void initializeGpu();

  dispose = () => {
    isDisposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('pointermove', move);
    document.documentElement.removeEventListener('pointerleave', resetPointer);
    document.removeEventListener('visibilitychange', resume);
    motionPreference.removeEventListener('change', resume);
    gpuContext?.unconfigure();
    uniforms?.destroy();
    device?.destroy();
  };
});

onBeforeUnmount(() => dispose?.());
</script>

<template>
  <div
    class="landing-background"
    aria-hidden="true"
    :data-renderer="isGpuReady ? 'webgpu' : 'canvas'"
  >
    <canvas ref="fallbackCanvas" :class="{ 'is-hidden': isGpuReady }" />
    <canvas ref="gpuCanvas" :class="{ 'is-hidden': !isGpuReady }" />
  </div>
</template>

<style scoped>
.landing-background {
  position: absolute;
  z-index: -1;
  inset: 0 max(0px, calc((100vw - 1920px) / 2)) 0 auto;
  width: min(68vw, 1306px);
  pointer-events: none;
  opacity: 0.85;
}
.landing-background canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
.is-hidden {
  visibility: hidden;
}
@media (max-width: 640px) {
  .landing-background {
    inset: 30% -25% 0 5%;
    width: auto;
    opacity: 0.5;
  }
}
</style>
