/// <reference types="vite/client" />
declare module 'virtual:course-pages' {
  import type { Component } from 'vue';
  const documents: Record<string, () => Promise<Component>>;

  export default documents;
}
declare module 'virtual:course-catalog' {
  import type { buildDocuments } from '@/runtime/course-documents';
  const documents: Omit<ReturnType<typeof buildDocuments>, 'assessmentDefinitions'>;

  export default documents;
}
declare module 'virtual:course-code/*' {
  const code: string;

  export default code;
}
declare module 'virtual:course-assessments' {
  import type { AssessmentDefinition } from '@/runtime/assessment-definitions';
  const definitions: Record<string, AssessmentDefinition>;

  export default definitions;
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
