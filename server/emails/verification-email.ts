/**
 * Transactional OTP email for waitlist handle claim (6-digit code).
 * Built as `html` + `text` for `resend.emails.send()` — same pattern as
 * https://resend.com/docs/send-with-nextjs (Next.js uses the same Node SDK).
 */

export type VerificationEmailParams = {
  username: string;
  code: string;
  /** Default 15 */
  expiresMinutes?: number;
  /** Product name in subject and header */
  appName?: string;
  /** Public site URL for footer link (no trailing slash) */
  appUrl?: string;
};

export function buildVerificationEmail(params: VerificationEmailParams): {
  subject: string;
  html: string;
  text: string;
} {
  const expiresMinutes = params.expiresMinutes ?? 15;
  const appName = params.appName?.trim() || 'GetIntro';
  const appUrl = params.appUrl?.replace(/\/$/, '') || '';
  const handle = `@${params.username}`;
  const code = params.code;

  const subject = `${code} is your ${appName} verification code`;

  const text = [
    `${appName} — verify your email`,
    '',
    `Your verification code for ${handle} is: ${code}`,
    '',
    `This code expires in ${expiresMinutes} minutes.`,
    '',
    `If you did not try to claim this username, you can ignore this email.`,
    appUrl ? `\n${appName}: ${appUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const safeAppName = escapeHtml(appName);
  const safeHandle = escapeHtml(handle);
  const safeCode = escapeHtml(code);
  const footerLink = appUrl
    ? `<a href="${escapeAttr(appUrl)}" style="color:#737373;text-decoration:underline;">${escapeHtml(appUrl.replace(/^https?:\/\//, ''))}</a>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${safeAppName}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">${safeCode} is your code for ${safeHandle}. Expires in ${expiresMinutes} minutes.</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding:28px 28px 8px 28px;">
              <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.02em;color:#71717a;text-transform:uppercase;">${safeAppName}</p>
              <h1 style="margin:12px 0 0 0;font-size:22px;font-weight:600;line-height:1.3;color:#18181b;">Verify your email</h1>
              <p style="margin:12px 0 0 0;font-size:15px;line-height:1.5;color:#52525b;">
                Use this code to confirm <strong style="color:#18181b;">${safeHandle}</strong> and lock in your spot on the waitlist.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 24px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#fafafa;border-radius:8px;border:1px dashed #d4d4d8;">
                <tr>
                  <td align="center" style="padding:20px 16px;">
                    <p style="margin:0 0 8px 0;font-size:12px;font-weight:500;letter-spacing:0.06em;color:#71717a;text-transform:uppercase;">Your code</p>
                    <p style="margin:0;font-family:ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace;font-size:32px;font-weight:700;letter-spacing:0.35em;color:#18181b;">${safeCode}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0 0;font-size:13px;line-height:1.5;color:#71717a;">
                This code expires in <strong style="color:#52525b;">${expiresMinutes} minutes</strong>. If you did not request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px 28px;border-top:1px solid #f4f4f5;">
              <p style="margin:20px 0 0 0;font-size:12px;line-height:1.5;color:#a1a1aa;">
                ${footerLink ? `This message was sent by ${safeAppName}. ${footerLink}` : `Sent by ${safeAppName}.`}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, '&#39;');
}
