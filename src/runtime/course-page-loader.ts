import type { Component } from 'vue';

type PageDocuments = Record<string, Component>;

const pages = new Map<string, PageDocuments>();
const pending = new Map<string, Promise<PageDocuments>>();
const receivers = new Map<string, (documents: PageDocuments) => void>();

export function registerCoursePage(page: string, documents: PageDocuments) {
  pages.set(page, documents);
  receivers.get(page)?.(documents);
}

export function loadCoursePage(page: string, route: string): Promise<PageDocuments> {
  const loaded = pages.get(page);

  if (loaded) {
    return Promise.resolve(loaded);
  }

  const current = pending.get(page);

  if (current) {
    return current;
  }

  const request = new Promise<PageDocuments>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`教程页面加载超时：${route}`)), 15000);

    const finish = (documents: PageDocuments) => {
      clearTimeout(timeout);
      resolve(documents);
    };

    const fail = (error: unknown) => {
      clearTimeout(timeout);
      reject(error);
    };

    receivers.set(page, finish);

    async function prepare() {
      let script = document.querySelector<HTMLScriptElement>(`script[data-course-page="${page}"]`);
      let append = false;

      if (!script) {
        const url = `${import.meta.env.BASE_URL}${route.replace(/^\//, '')}`;

        const response = await fetch(url, {
          headers: { Accept: 'text/html' },
          signal: AbortSignal.timeout(15000),
        });

        if (!response.ok) {
          throw new Error(`教程页面加载失败：${route} (${response.status})`);
        }

        const html = new DOMParser().parseFromString(await response.text(), 'text/html');

        const source = html.querySelector<HTMLScriptElement>(
          `script[type="module"][data-course-page="${page}"]`,
        );

        if (!source?.textContent) {
          throw new Error(`教程页面缺少内联模块：${route}`);
        }

        script = document.createElement('script');
        script.type = 'module';
        script.dataset.coursePage = page;
        script.textContent = source.textContent;
        append = true;
      }

      const element = script;
      element.addEventListener(
        'error',
        () => {
          element.remove();
          fail(new Error(`教程模块执行失败：${route}`));
        },
        { once: true },
      );
      element.addEventListener(
        'load',
        () => {
          if (!pages.has(page)) {
            element.remove();
            fail(new Error(`教程模块未注册：${route}`));
          }
        },
        { once: true },
      );

      if (append) {
        document.head.append(element);
      }
    }

    void prepare().catch(fail);
  }).finally(() => {
    pending.delete(page);
    receivers.delete(page);
  });

  pending.set(page, request);
  return request;
}
