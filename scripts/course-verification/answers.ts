import type { CourseData, VerificationContext } from './types';

// 判题函数需要实际执行，与课程字段和映射检查独立。
export function verifyAnswers(data: CourseData, context: VerificationContext) {
  const check = (condition: unknown, id: string, message: string) =>
    context.check(condition, id, message, 'answers');

  for (const question of data.chapters.flatMap(chapter => chapter.questions)) {
    if (question.kind === 'code') {
      continue;
    }

    const entry = data.assessments[question.id];
    const id = question.id;

    if (!entry || typeof entry.accept !== 'function') {
      check(false, id, '文本答案缺少 accept 函数');
      continue;
    }

    try {
      check(entry.accept(entry.answer) === true, id, 'accept 未接受参考答案');

      for (const invalid of ['', '__VERIFY_INVALID_ANSWER__']) {
        check(
          entry.accept(invalid) === false,
          id,
          `accept 未明确拒绝无效输入 ${JSON.stringify(invalid)}`,
        );
      }

      if (question.kind === 'choice') {
        if (
          !check(
            Array.isArray(question.options) && question.options.length >= 2,
            id,
            'choice 至少需要两个选项',
          )
        ) {
          continue;
        }

        for (const option of question.options!) {
          check(
            entry.accept(option) === (option === entry.answer),
            id,
            `accept 对选项 ${JSON.stringify(option)} 判定错误`,
          );
        }
      }
    } catch (error) {
      check(
        false,
        id,
        `accept 抛出异常：${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
