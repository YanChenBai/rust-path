<script setup lang="ts">
import { X, ArrowUpRight, BookOpen, Zap, Flag, ExternalLink } from 'lucide-vue-next';

import { useCourseSearch } from '../../composables/useCourseSearch';
import { sources } from '../../data/course';
const showSearch = defineModel<boolean>('searchOpen', { required: true });
const showHelp = defineModel<boolean>('helpOpen', { required: true });
const { search, searchResults } = useCourseSearch();
const emit = defineEmits<{ navigate: [id: string] }>();

function navigate(id: string) {
  showSearch.value = false;
  emit('navigate', id);
}
</script>
<template>
  <Transition name="modal"
    ><div
      v-if="showSearch || showHelp"
      class="modal-backdrop"
      @click.self="
        showSearch = false;
        showHelp = false;
      "
    >
      <section
        class="dialog"
        role="dialog"
        aria-modal="true"
        :aria-label="showSearch ? '搜索知识点' : '学习指南'"
      >
        <div class="dialog-header">
          <h2>{{ showSearch ? '你想探索什么？' : '欢迎来到 Rust Path' }}</h2>
          <button
            class="icon-button"
            aria-label="关闭对话框"
            @click="
              showSearch = false;
              showHelp = false;
            "
          >
            <X :size="20" />
          </button>
        </div>
        <template v-if="showSearch"
          ><input
            v-model="search"
            class="search-input"
            placeholder="搜索 if、借用、循环…"
            aria-label="搜索课程"
            autofocus
          />
          <div class="search-results">
            <button v-for="item in searchResults" :key="item.id" @click="navigate(item.id)">
              <BookOpen :size="17" />
              <div>
                <strong>{{ item.title }}</strong
                ><span>{{ item.chapter }} · {{ item.subtitle }}</span>
              </div>
              <ArrowUpRight :size="15" />
            </button>
            <p v-if="!searchResults.length" class="muted">还没找到，试试更短的关键词。</p>
          </div></template
        ><template v-else
          ><p class="help-intro">这是一条以实践为中心的学习路线。每一章都遵循同样的节奏：</p>
          <ol class="help-steps">
            <li>
              <BookOpen :size="21" />
              <div>
                <strong>理解一个小概念</strong>
                <p>阅读说明，修改示例，运行一次真实 Rust 代码。</p>
              </div>
            </li>
            <li>
              <Zap :size="21" />
              <div>
                <strong>让理解经得起检查</strong>
                <p>完成选择、填空与编程；错误尝试达到 3 次才可查看解析。</p>
              </div>
            </li>
            <li>
              <Flag :size="21" />
              <div>
                <strong>创造一个完整的小作品</strong>
                <p>本章题目全对后解锁实操，结合前面章节解决问题。</p>
              </div>
            </li>
          </ol>
          <div class="help-local">
            <HardDrive :size="18" />无需账号。进度和草稿保存在当前浏览器，可在「学习足迹」导出备份。
          </div>
          <div class="help-sources">
            <h3>课程参考</h3>
            <a
              v-for="source in sources"
              :key="source.url"
              :href="source.url"
              target="_blank"
              rel="noopener noreferrer"
              >{{ source.name }}<ExternalLink :size="13"
            /></a></div
        ></template>
      </section></div
  ></Transition>
</template>
