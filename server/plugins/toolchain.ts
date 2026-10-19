import { definePlugin } from 'nitro';

import { closeRust } from '../rust.mjs';

export default definePlugin(app => {
  app.hooks.hook('close', closeRust);
});
