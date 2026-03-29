export async function postSendCode(username: string, email: string) {
  return fetch('/api/claim/send-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email }),
  });
}

export async function postVerifyCode(username: string, email: string, code: string) {
  return fetch('/api/claim/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, code }),
  });
}
