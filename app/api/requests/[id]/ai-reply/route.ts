import { NextRequest } from 'next/server';
import { store } from '@/lib/store';

const DRAFTS: Record<string, Record<string, string>> = {
  draft: {
    default: "Thanks for reaching out — this looks interesting. Can you share more context and we can go from there?",
    r1: "Amelia — thanks for the intro from Priya. Numbers look serious. Can you send the deck + a link to your cap table? I can do a call Thursday 2pm PT if that works.",
    r2: "Jonas — great question, and one I've thought about a lot. Short version: I stayed because the scope kept expanding. The moment the scope stops expanding faster than your ambition, that's the signal.",
    r3: "Teo — I'm selectively doing podcasts this quarter. Send me a topic list and I'll let you know if it's a fit.",
  },
  warmer: {
    default: "Hey! Really glad you reached out — this is exactly the kind of conversation I enjoy. Let's find a time to talk.",
    r1: "Amelia!! Priya vouching for you means a lot. Love the traction numbers — let's talk. Send me the deck and let's do Thursday 2pm PT.",
    r2: "Jonas, I really appreciate you asking this — it's the kind of honest career question I wish more people asked. Here's what I've learned...",
  },
  shorter: {
    default: "Interesting — send me more and let's talk.",
    r1: "Deck + cap table → I'll review by EOD. Thursday 2pm PT for a call?",
    r2: "Stayed because scope kept expanding. Signal to leave: it stops.",
  },
  deck: {
    default: "Can you send a deck with the key numbers and context? I'll review before we connect.",
    r1: "Can you send the deck, cap table, and last 6 months of MRR? I'll review before we get on a call.",
    r2: "Mind writing up your situation in a doc — comp, offer details, what you'd be walking away from — so I can give you a more grounded read?",
  },
  time: {
    default: "Happy to chat — does Thursday or Friday afternoon PT work for you?",
    r1: "Thursday 2pm PT or Friday 10am PT — which works?",
    r2: "Can do a 20-min call Thursday 3pm PT if you want to think out loud. Does that work?",
  },
};

function getDraft(requestId: string, tone: string): string {
  const toneMap = DRAFTS[tone] || DRAFTS.draft;
  return toneMap[requestId] || toneMap.default || DRAFTS.draft.default;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const tone = req.nextUrl.searchParams.get('tone') || 'draft';
  const request = store.getById(params.id);
  if (!request) {
    return new Response('Not found', { status: 404 });
  }

  const text = getDraft(params.id, tone);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Stream characters with slight delay for typing effect
      for (const char of text) {
        const data = JSON.stringify({ type: 'char', char });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        await new Promise(res => setTimeout(res, 18 + Math.random() * 24));
      }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
