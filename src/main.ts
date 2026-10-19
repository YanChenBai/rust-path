import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import CourseCallout from './components/docs/CourseCallout.vue';
import LessonGuides from './components/docs/LessonGuides.vue';
import MarkdownCode from './components/docs/MarkdownCode.vue';

import './style.css';

const app = createApp(App);

app.use(createPinia());
app.component('CourseCallout', CourseCallout);
app.component('LessonGuides', LessonGuides);
app.component('MarkdownCode', MarkdownCode);

app.mount('#app');
