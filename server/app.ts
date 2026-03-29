import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomInt } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import express from 'express';
import { render, toPlainText } from '@react-email/render';
import { Resend } from 'resend';
import VerificationEmail from './emails/VerificationEmail';
import { getVerificationEmailSubject } from './emails/verification-email';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

/** Vercel invokes this app with paths like `/api/claim/...`; local dev uses `/claim/...` (Vite strips `/api`). */
app.use((req, _res, next) => {
  if (req.url?.startsWith('/api')) {
    req.url = req.url.slice(4) || '/';
  }
  next();
});

app.use(express.json({ limit: '32kb' }));

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM;
const CLAIM_SECRET = process.env.CLAIM_CODE_SECRET;
const APP_NAME = process.env.APP_NAME?.trim() || 'GetIntro';

function publicAppUrl(): string {
  const explicit =
    process.env.APP_URL?.trim() ||
    process.env.VITE_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');
  const v = process.env.VERCEL_URL?.trim();
  if (v) return `https://${v}`;
  return '';
}

const CODE_TTL_MS = 15 * 60 * 1000;

function normalizeUsername(raw: string) {
  return raw.toLowerCase().trim();
}

function normalizeEmail(raw: string) {
  return raw.toLowerCase().trim();
}

function isValidUsername(u: string) {
  return u.length >= 1 && u.length <= 30 && /^[a-z0-9_]+$/.test(u);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(e: string) {
  return EMAIL_RE.test(e);
}

function hashCode(email: string, code: string) {
  const secret = CLAIM_SECRET ?? '';
  return createHash('sha256').update(`${secret}:${email}:${code}`).digest('hex');
}

function generateSixDigitCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.warn('[api] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — claim routes will 500.');
}
if (!RESEND_KEY || !RESEND_FROM) {
  console.warn('[api] Missing RESEND_API_KEY or RESEND_FROM — send-code will 500.');
}
if (!CLAIM_SECRET) {
  console.warn('[api] Missing CLAIM_CODE_SECRET — set a long random string in production.');
}

const supabaseAdmin =
  SUPABASE_URL && SERVICE_KEY ? createClient(SUPABASE_URL, SERVICE_KEY) : null;

const resend = RESEND_KEY ? new Resend(RESEND_KEY) : null;

/** For ops and local e2e checks — no secrets returned */
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'getintro-api',
    configured: {
      supabase: Boolean(SUPABASE_URL && SERVICE_KEY),
      resend: Boolean(RESEND_KEY && RESEND_FROM),
      claimSecret: Boolean(CLAIM_SECRET),
    },
  });
});

/** Mounted under /api on Vercel — full path is /api/claim/... */
app.post('/claim/send-code', async (req, res) => {
  if (!supabaseAdmin || !resend || !RESEND_FROM) {
    res.status(500).json({ error: 'Server is not configured for email.' });
    return;
  }

  const username = typeof req.body?.username === 'string' ? normalizeUsername(req.body.username) : '';
  const email = typeof req.body?.email === 'string' ? normalizeEmail(req.body.email) : '';

  if (!isValidUsername(username)) {
    res.status(400).json({ error: 'Pick a valid handle first.' });
    return;
  }
  if (!isValidEmail(email)) {
    res.status(400).json({ error: 'That email does not look quite right.' });
    return;
  }

  const { data: takenUser } = await supabaseAdmin
    .from('waitlist')
    .select('username')
    .eq('username', username)
    .maybeSingle();

  if (takenUser) {
    res.status(409).json({ error: 'That handle is already spoken for.' });
    return;
  }

  const { data: emailRow } = await supabaseAdmin
    .from('waitlist')
    .select('username, email')
    .eq('email', email)
    .maybeSingle();

  if (emailRow && emailRow.username !== username) {
    res.status(409).json({ error: 'This email already has a spot — one inbox, one handle.' });
    return;
  }

  await supabaseAdmin
    .from('claim_verifications')
    .delete()
    .eq('email', email)
    .eq('username', username)
    .eq('consumed', false);

  const code = generateSixDigitCode();
  const codeHash = hashCode(email, code);
  const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString();

  const { error: insErr } = await supabaseAdmin.from('claim_verifications').insert({
    email,
    username,
    code_hash: codeHash,
    expires_at: expiresAt,
    consumed: false,
  });

  if (insErr) {
    console.error('[api] claim_verifications insert', insErr);
    res.status(500).json({ error: 'Could not start verification. Try again.' });
    return;
  }

  const subject = getVerificationEmailSubject({ username, code, appName: APP_NAME });
  const appUrl = publicAppUrl();

  /** Pre-render to HTML — Resend’s `react` prop often fails on Vercel serverless; `html` + `text` is reliable. */
  let html: string;
  let text: string;
  try {
    const node = VerificationEmail({
      username,
      code,
      expiresMinutes: CODE_TTL_MS / 60_000,
      appName: APP_NAME,
      appUrl: appUrl || undefined,
    });
    html = await render(node);
    text = toPlainText(html);
  } catch (e) {
    console.error('[api] render verification email', e);
    res.status(500).json({
      error: 'Could not build the email. Try again.',
    });
    return;
  }

  let sendResult: Awaited<ReturnType<typeof resend.emails.send>>;
  try {
    sendResult = await resend.emails.send({
      from: RESEND_FROM,
      to: [email],
      subject,
      html,
      text,
      headers: {
        'Idempotency-Key': `claim-code/${email}/${username}/${expiresAt}`,
      },
    });
  } catch (e) {
    console.error('[api] Resend network error', e);
    res.status(502).json({ error: 'Could not send the email. Try again shortly.' });
    return;
  }

  const { data, error } = sendResult;

  if (error) {
    console.error('[api] Resend error', error);
    res.status(502).json({ error: 'Could not send the email. Try again shortly.' });
    return;
  }

  console.log('[api] Resend ok', data?.id);
  res.json({ ok: true });
});

app.post('/claim/verify', async (req, res) => {
  if (!supabaseAdmin) {
    res.status(500).json({ error: 'Server is not configured.' });
    return;
  }

  const username = typeof req.body?.username === 'string' ? normalizeUsername(req.body.username) : '';
  const email = typeof req.body?.email === 'string' ? normalizeEmail(req.body.email) : '';
  const rawCode = typeof req.body?.code === 'string' ? req.body.code.replace(/\D/g, '') : '';

  if (!isValidUsername(username) || !isValidEmail(email)) {
    res.status(400).json({ error: 'Something looks off — double-check your handle and email.' });
    return;
  }
  if (rawCode.length !== 6) {
    res.status(400).json({ error: 'Enter the 6-digit code from your email.' });
    return;
  }

  const nowIso = new Date().toISOString();
  const { data: rows, error: selErr } = await supabaseAdmin
    .from('claim_verifications')
    .select('id, code_hash, expires_at, consumed')
    .eq('email', email)
    .eq('username', username)
    .eq('consumed', false)
    .gte('expires_at', nowIso)
    .order('created_at', { ascending: false })
    .limit(1);

  if (selErr || !rows?.length) {
    res.status(400).json({ error: 'No active code for that combo. Request a new code.' });
    return;
  }

  const row = rows[0];
  const expected = hashCode(email, rawCode);
  if (row.code_hash !== expected) {
    res.status(400).json({ error: 'That code does not match. Try again or resend.' });
    return;
  }

  const { error: upErr } = await supabaseAdmin
    .from('claim_verifications')
    .update({ consumed: true })
    .eq('id', row.id);

  if (upErr) {
    console.error('[api] consume verification', upErr);
    res.status(500).json({ error: 'Could not complete verification.' });
    return;
  }

  const { error: wlErr } = await supabaseAdmin.from('waitlist').insert({
    username,
    email,
  });

  if (wlErr) {
    if (wlErr.code === '23505') {
      res.status(409).json({ error: 'That handle or email is already in use.' });
      return;
    }
    console.error('[api] waitlist insert', wlErr);
    res.status(500).json({ error: 'Could not save your spot. Try again.' });
    return;
  }

  res.json({ ok: true });
});

export default app;
