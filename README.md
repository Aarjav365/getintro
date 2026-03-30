# GetIntro

A React + Vite landing experience for a private network waitlist. Visitors choose a handle, verify their email with a time-limited code, and are recorded in Supabase after successful verification. Email delivery uses [Resend](https://resend.com); the backend can run locally with Express or on [Vercel](https://vercel.com) as serverless API routes.

**Repository:** [github.com/Aarjav365/getintro](https://github.com/Aarjav365/getintro)

---

## Features

- **Handle claim flow** — Username validation, email capture, 6-digit OTP, success and error states (`react-router-dom`).
- **Server-side waitlist** — Inserts go through the API after verification; hashed codes stored in `claim_verifications`, confirmed users in `waitlist`.
- **Transactional email** — HTML/text verification messages via Resend with idempotency keys.
- **Health and diagnostics** — `GET /health` reports configuration flags without exposing secrets.
- **Production-aligned dev** — Vite dev server proxies `/api` to the local Express app on port `3005`, matching `/api/*` paths used on Vercel.

---

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | React 19, TypeScript, Tailwind CSS 4, Motion, Lucide |
| Routing | React Router 7 |
| Build | Vite 6 |
| API | Express 4 (local) / Vercel Node handlers under `api/` |
| Data | Supabase (PostgreSQL + RLS) |
| Email | Resend |

---

## Prerequisites

- **Node.js** — Current LTS recommended (project uses `"type": "module"`).
- **npm** — Lockfile: `package-lock.json`.
- **Supabase project** — For `waitlist` and `claim_verifications` (apply migrations in `supabase/migrations/`).
- **Resend account** — API key and a verified sending domain / `from` address.

Optional: **Gemini** — `GEMINI_API_KEY` is referenced in Vite config for AI Studio–style builds; not required for the core waitlist flow.

---

## Quick start

```bash
git clone https://github.com/Aarjav365/getintro.git
cd getintro
npm install
cp .env.example .env
# Edit .env with your Supabase, Resend, and claim secret values (see below).
```

Apply database migrations in the Supabase SQL editor or CLI (`supabase db push`), using files in order:

1. `supabase/migrations/20260329000000_waitlist.sql`
2. `supabase/migrations/20260329120000_claim_verification.sql`

Verify configuration (does not send email):

```bash
npm run check:claim
```

Start the full stack (Vite + API):

```bash
npm run dev
```

- **App:** [http://127.0.0.1:3002](http://127.0.0.1:3002)
- **API (direct):** [http://127.0.0.1:3005](http://127.0.0.1:3005) — use [http://127.0.0.1:3005/health](http://127.0.0.1:3005/health) for a quick config check

---

## npm scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Runs Vite (`127.0.0.1:3002`) and the API watcher (`127.0.0.1:3005`) together |
| `npm run dev:vite` | Frontend only |
| `npm run dev:api` | API only (`tsx watch server/index.ts`) |
| `npm run build` | Production client build to `dist/` |
| `npm run preview` | Serves the built app on port `3002` (run the API separately on `3005` for `/api` proxy) |
| `npm run lint` | Typecheck with `tsc --noEmit` |
| `npm run check:claim` | Validates required env vars for claim + email |
| `npm run clean` | Removes `dist/` (Unix-style `rm`; on Windows you may delete `dist` manually) |

---

## Environment variables

Copy `.env.example` to `.env` and set values. Summary:

### Client (Vite)

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public anon key (client-safe) |

### Server (API — never expose to the browser)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Same project URL as above (no `VITE_` prefix) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key; only on the server. Alias: `SUPABASE_SECRET_KEY` |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM` | Verified sender, e.g. `GetIntro <noreply@yourdomain.com>` |
| `CLAIM_CODE_SECRET` | Long random string used to hash verification codes |
| `APP_NAME` | Shown in emails (default: `GetIntro`) |
| `APP_URL` | Public site URL for links in emails; on Vercel, `VERCEL_URL` is used if unset |
| `API_PORT` | Optional; default `3005` for local Express |

### Optional

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Injected into the client bundle via Vite `define` when present |
| `DISABLE_HMR` | Set to `true` to disable Vite HMR (e.g. agent / AI Studio environments) |

---

## API overview

Routes are mounted under `/api` in production (`/api/claim/...`). Locally, Vite proxies `/api` to the Express app and strips the `/api` prefix before routing.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | JSON: `ok`, `service`, `configured` flags |
| `POST` | `/claim/send-code` | Body: `username`, `email` — validates, stores hashed code, sends email |
| `POST` | `/claim/verify` | Body: `username`, `email`, `code` — verifies OTP and inserts `waitlist` row |

Codes expire after **15 minutes**. The API returns JSON errors with appropriate HTTP status codes (`400`, `409`, `500`, `502`, etc.).

---

## Project structure

```
├── api/                 # Vercel serverless handlers + shared Express app
│   ├── _app/            # Express app, email template
│   ├── claim/           # Route entry points (re-export app handlers)
│   └── health.ts
├── server/index.ts      # Local API entry (listens on API_PORT)
├── src/                 # React SPA
│   ├── pages/           # Landing + claim flow
│   ├── lib/             # API client, username helpers
│   └── layouts/
├── supabase/migrations/ # SQL schema and RLS
├── scripts/             # check-claim-setup.mjs
├── vite.config.ts       # Dev/preview proxy to :3005
└── vercel.json          # SPA fallback rewrites (excludes /api and /assets)
```

---

## Deployment (Vercel)

1. Connect the GitHub repository to Vercel.
2. Set **Environment Variables** in the Vercel project to match the server variables above (`SUPABASE_*`, `RESEND_*`, `CLAIM_CODE_SECRET`, `APP_URL` / rely on `VERCEL_URL`, etc.).
3. Ensure Supabase migrations are applied to the linked project.
4. `vercel.json` rewrites non-API routes to `index.html` for client-side routing.

The shared logic lives in `api/_app/app.ts`; Vercel `api/*.ts` files import that app so behavior stays consistent with local Express.

---

## Security notes

- **Service role key** — Use only in server / Vercel env. Never commit it or prefix it with `VITE_`.
- **`CLAIM_CODE_SECRET`** — If leaked, rotate it and invalidate outstanding codes; codes are stored as hashes, not plaintext.
- **RLS** — `claim_verifications` has no public policies; only the service role used by the API should access it. Waitlist policies evolve with migrations (public insert may be restricted after verification flow is enforced).

---

## License

Private repository (`"private": true` in `package.json`). Add a `LICENSE` file and update this section if you open-source the project.

---

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/Aarjav365/getintro). For local changes, run `npm run lint` before submitting.
