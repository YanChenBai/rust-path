import { ref } from 'vue';

// 首屏与静态 HTML 一致；挂载后的页面切换继续播放入场动画。
export const pageAnimationsReady = ref(false);
