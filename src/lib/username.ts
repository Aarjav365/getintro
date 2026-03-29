export function normalizeUsername(raw: string) {
  return raw.toLowerCase().trim();
}

export function validateUsername(u: string): string | null {
  const n = normalizeUsername(u);
  if (n.length > 30) return 'Keep it to 30 characters or less.';
  if (!/^[a-z0-9_]+$/.test(n)) return 'Letters, numbers, and underscores only.';
  return null;
}
