/// <reference types="vite/client" />
declare module 'virtual:course-catalog' {
  import type { buildDocuments } from '@/runtime/course-documents';
  const documents: ReturnType<typeof buildDocuments>;

  export default documents;
}
declare module '*.md' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;

  export default component;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, unknown>;

  export default component;
}
declare module 'monaco-editor/editor/contrib/*';
declare module 'monaco-editor/languages/definitions/rust/rust.js' {
  import type { languages } from 'monaco-editor/editor/editor.api.js';

  export const language: languages.IMonarchLanguage;

  export const conf: languages.LanguageConfiguration;
}
