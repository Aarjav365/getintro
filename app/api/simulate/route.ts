import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import type { Request } from '@/lib/types';

const FAKE_SENDERS = [
  { name: 'Ava Thornton', role: 'Founder · Petal AI', color: 'pink' as const, initials: 'AT' },
  { name: 'Marcus Webb', role: 'Partner · Emergence Capital', color: 'blue' as const, initials: 'MW' },
  { name: 'Layla Osei', role: 'CPO · Linear', color: 'purple' as const, initials: 'LO' },
  { name: 'Dev Khanna', role: 'Solo founder · stealth', color: 'green' as const, initials: 'DK' },
  { name: 'Nora Fitch', role: 'Engineer · Vercel', color: 'teal' as const, initials: 'NF' },
];

const FAKE_SUBJECTS = [
  'Pre-seed raise — AI-native legal ops',
  'Intro to your co-investors at Harbor?',
  'Collab on upcoming fintech policy piece',
  'Quick question on your Stripe tenure',
  'Looking for a technical advisor (dev infra)',
];

export async function POST() {
  const sender = FAKE_SENDERS[Math.floor(Math.random() * FAKE_SENDERS.length)];
  const subject = FAKE_SUBJECTS[Math.floor(Math.random() * FAKE_SUBJECTS.length)];

  const types = ['invest', 'intro', 'mentor', 'collab'] as const;
  const type = types[Math.floor(Math.random() * types.length)];

  const fakeRequest: Request = {
    id: `sim-${Date.now()}`,
    unread: true,
    status: 'pending',
    sender: {
      name: sender.name,
      role: sender.role,
      avatar: { color: sender.color, initials: sender.initials },
    },
    type,
    typeLabel: { invest: 'Pitch', intro: 'Intro request', mentor: 'Mentorship', collab: 'Collab' }[type],
    subject,
    preview: 'Just came in — tap to read the full message.',
    time: 'just now',
    date: new Date().toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' }),
    message: ['This is a simulated incoming request to demonstrate real-time delivery.'],
    fields: {},
    ai: {
      fit: Math.floor(Math.random() * 30) + 60,
      reasons: [
        { k: 'thesis', v: 'Matches your stated focus areas.' },
        { k: 'warm', v: 'No shared connections found.' },
      ],
    },
  };

  const created = store.add(fakeRequest);
  return NextResponse.json(created, { status: 201 });
}
