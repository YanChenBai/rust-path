import { Code2, Flag, Zap, Trophy } from 'lucide-vue-next';
import { computed } from 'vue';

import { chapters } from '../data/course';
import { progress, chapterCompletion } from '../progress';

export function useLearningStats() {
  const week = computed(() =>
    Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 6 + i);
      return {
        day: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
        active: Boolean(progress.activity[date.toLocaleDateString('en-CA')]),
        today: i === 6,
      };
    }),
  );

  const achievements = computed(() => [
    {
      title: 'Hello, Rust!',
      subtitle: '成功运行第一段代码',
      icon: Code2,
      earned: progress.ran.length > 0,
    },
    {
      title: '小步快跑',
      subtitle: '完成 3 个知识点',
      icon: Flag,
      earned: progress.completed.length >= 3,
    },
    {
      title: '知行合一',
      subtitle: '通过一个章节的全部挑战',
      icon: Zap,
      earned: chapters.some(c => c.questions.every(q => progress.passed.includes(q.id))),
    },
    {
      title: '真正的创造者',
      subtitle: '完成第一个专项项目',
      icon: Trophy,
      earned: progress.passed.some(id => id.endsWith('-project')),
    },
  ]);

  function lessonCount(id: string) {
    return chapters.find(c => c.id === id)!.lessons.filter(l => progress.completed.includes(l.id))
      .length;
  }

  function questionCount(id: string) {
    return chapters.find(c => c.id === id)!.questions.filter(q => progress.passed.includes(q.id))
      .length;
  }

  function chapterPercent(id: string) {
    return chapterCompletion(id);
  }

  return { week, achievements, lessonCount, questionCount, chapterPercent };
}
