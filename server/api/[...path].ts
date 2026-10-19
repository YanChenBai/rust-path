import { defineHandler, readBody } from 'nitro/h3';

import { handleNative } from '../rust.mjs';
import { executionStream } from '../stream';

// oxlint-disable-next-line complexity
export default defineHandler(async event => {
  const url = new URL(event.req.url);

  if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    return new Response('仅支持本机学习使用', { status: 403 });
  }

  const origin = event.req.headers.get('origin');

  if (origin && origin !== url.origin) {
    return new Response('Origin rejected', { status: 403 });
  }

  if (event.req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await readBody(event);

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return Response.json({ error: '请求内容必须是对象' }, { status: 400 });
    }

    if (new TextEncoder().encode(JSON.stringify(body)).byteLength > 150000) {
      return new Response('Body too large', { status: 413 });
    }

    if (url.pathname === '/api/run' && 'stream' in body && body.stream === true) {
      if (!('code' in body) || typeof body.code !== 'string') {
        return Response.json({ error: '代码必须是字符串' }, { status: 400 });
      }

      return executionStream(body as Parameters<typeof executionStream>[0], event.req.signal);
    }

    return await handleNative(url.pathname, body);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : '工具链不可用' },
      { status: 400 },
    );
  }
});
