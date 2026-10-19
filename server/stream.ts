import { handleNative, runNative } from './rust.mjs';

type RunBody = Parameters<typeof runNative>[0];

export function executionStream(body: RunBody, signal: AbortSignal) {
  let closed = false;
  const encoder = new TextEncoder();
  const decoders = { stdout: new TextDecoder(), stderr: new TextDecoder() };

  const stop = () => {
    closed = true;
    void handleNative('/api/stop', { requestId: body.requestId }).catch(() => {});
  };

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (value: unknown) => {
        if (!closed) {
          controller.enqueue(encoder.encode(`${JSON.stringify(value)}\n`));
        }
      };

      signal.addEventListener('abort', stop, { once: true });
      void runNative(body, {
        onOutput(channel, chunk) {
          send({
            type: 'output',
            channel,
            text: decoders[channel].decode(chunk, { stream: true }),
          });
        },
      })
        .then(result => {
          for (const channel of ['stdout', 'stderr'] as const) {
            const text = decoders[channel].decode();

            if (text) {
              send({ type: 'output', channel, text });
            }
          }

          send({ type: 'result', ...result });
        })
        .catch(error => {
          send({ type: 'error', message: error instanceof Error ? error.message : '执行失败' });
        })
        .finally(() => {
          signal.removeEventListener('abort', stop);

          if (!closed) {
            closed = true;
            controller.close();
          }
        });
    },
    cancel: stop,
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
}
