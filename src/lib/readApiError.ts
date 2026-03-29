export async function readApiError(res: Response): Promise<string> {
  const ct = res.headers.get('content-type') ?? '';
  if (ct.includes('text/html')) {
    return 'The app received a web page instead of the API (often a Vercel routing issue). Confirm /api routes are not rewritten to index.html.';
  }
  const raw = await res.text();
  try {
    const j = JSON.parse(raw) as {
      error?: string | { message?: string };
      message?: string;
    };
    if (typeof j.error === 'string') return j.error;
    if (j.error && typeof j.error === 'object' && typeof j.error.message === 'string') {
      return j.error.message;
    }
    if (typeof j.message === 'string') return j.message;
  } catch {
    /* not JSON */
  }
  const snippet = raw.trim().slice(0, 160);
  if (snippet) return `Error (${res.status}): ${snippet}`;
  if (res.status >= 500) {
    return `Server error (${res.status}) with no message body. If this persists, check the API logs, env vars (Supabase + Resend), and GET /api/health.`;
  }
  return `Something went sideways (${res.status}). Try again.`;
}
