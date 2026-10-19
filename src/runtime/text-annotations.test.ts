import { describe, expect, it } from 'vite-plus/test';

import { locateAnnotation } from './text-annotations';

describe('文字注释定位', () => {
  it('前文增加内容后通过引文与上下文恢复位置', () => {
    const anchor = { quote: '不可变', prefix: '变量默认', suffix: '，可使用 mut', start: 4 };
    const text = '新增的说明。变量默认不可变，可使用 mut 修改。';
    const match = locateAnnotation(text, anchor);
    expect(match).toBeDefined();
    expect(text.slice(match!.start, match!.end)).toBe('不可变');
    expect(match!.start).toBe(text.indexOf('不可变'));
  });

  it('重复引文优先匹配上下文，避免误放到第一处', () => {
    const text = '第一段 Rust 基础。第二段 Rust 实践。';

    const match = locateAnnotation(text, {
      quote: 'Rust',
      prefix: '第二段 ',
      suffix: ' 实践。',
      start: 0,
    });

    expect(match?.start).toBe(text.lastIndexOf('Rust'));
  });

  it('上下文相同时选择离原始偏移最近的位置', () => {
    expect(
      locateAnnotation('Rust Rust Rust', { quote: 'Rust', prefix: '', suffix: '', start: 10 })
        ?.start,
    ).toBe(10);
  });

  it('引文已删除时不把注释附在无关文字上', () => {
    expect(
      locateAnnotation('新的内容', { quote: '原来的内容', prefix: '', suffix: '', start: 0 }),
    ).toBeUndefined();
  });
});
