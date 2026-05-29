import { store } from '@/lib/store';
import type { SSEEvent } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send connected event
      const connected: SSEEvent = { type: 'connected', timestamp: Date.now() };
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(connected)}\n\n`));

      // Subscribe to store events
      const unsubscribe = store.subscribe((event) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch {
          // Client disconnected
        }
      });

      // Heartbeat every 25 seconds
      const heartbeat = setInterval(() => {
        try {
          const hb: SSEEvent = { type: 'heartbeat', timestamp: Date.now() };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(hb)}\n\n`));
        } catch {
          clearInterval(heartbeat);
        }
      }, 25000);

      // Cleanup when client disconnects
      return () => {
        clearInterval(heartbeat);
        unsubscribe();
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
