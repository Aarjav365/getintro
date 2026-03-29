#!/usr/bin/env node
/**
 * Quick local check: required env vars for claim + email flow (does not send email).
 * Usage: node scripts/check-claim-setup.mjs
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(root, '.env') });

const required = [
  ['SUPABASE_URL or VITE_SUPABASE_URL', () => process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL],
  ['SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY', () => process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY],
  ['RESEND_API_KEY', () => process.env.RESEND_API_KEY],
  ['RESEND_FROM', () => process.env.RESEND_FROM],
  ['CLAIM_CODE_SECRET', () => process.env.CLAIM_CODE_SECRET],
];

let ok = true;
console.log('Claim + email configuration\n');
for (const [label, get] of required) {
  const v = get();
  const present = Boolean(v && String(v).trim());
  console.log(`  ${present ? '✓' : '✗'} ${label}`);
  if (!present) ok = false;
}
console.log('');
if (!ok) {
  console.log('Fix .env (see .env.example), then run: npm run dev');
  process.exit(1);
}
console.log('All required variables are set.');
console.log('\nNext:');
console.log('  1. npm run dev');
console.log('  2. GET http://127.0.0.1:3005/health  → configured flags should be true');
console.log('  3. Complete the waitlist flow in the app (send code → verify).');
process.exit(0);
