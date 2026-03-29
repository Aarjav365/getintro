/**
 * Subject line for the verification email (used with React Email + Resend `react` prop).
 */

export type VerificationEmailParams = {
  username: string;
  code: string;
  appName?: string;
};

export function getVerificationEmailSubject(params: VerificationEmailParams): string {
  const appName = params.appName?.trim() || 'GetIntro';
  return `${params.code} is your ${appName} verification code`;
}
