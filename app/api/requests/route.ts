import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import type { Request } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(store.getAll());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = `r${Date.now()}`;
  const newRequest: Request = {
    id,
    unread: true,
    status: 'pending',
    sender: {
      name: body.name || 'Anonymous',
      role: body.role || 'Unknown',
      avatar: { color: 'blue', initials: (body.name || 'A').split(' ').map((w: string) => w[0]).join('').slice(0, 2) },
    },
    type: body.typeId || 'call',
    typeLabel: body.typeName || 'Request',
    subject: body.message ? body.message.slice(0, 60) : `New ${body.typeName || 'request'}`,
    preview: body.message || '',
    time: 'just now',
    date: new Date().toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' }),
    message: body.message ? [body.message] : [],
    fields: { Urgency: body.urgency || 'normal' },
  };
  const created = store.add(newRequest);
  return NextResponse.json(created, { status: 201 });
}
