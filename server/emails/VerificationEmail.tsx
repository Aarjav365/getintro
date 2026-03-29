import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export type VerificationEmailProps = {
  username: string;
  code: string;
  expiresMinutes?: number;
  appName?: string;
  appUrl?: string;
};

/** Render with `@react-email/render` (see server `app.ts`); call as `VerificationEmail({ ... })` for a React element. */
export default function VerificationEmail({
  username,
  code,
  expiresMinutes = 15,
  appName = 'GetIntro',
  appUrl,
}: VerificationEmailProps) {
  const handle = `@${username}`;
  const host = appUrl ? appUrl.replace(/^https?:\/\//, '') : '';

  return (
    <Html lang="en">
      <Head />
      <Preview>
        {code} is your code for {handle}. Expires in {expiresMinutes} minutes.
      </Preview>
      <Body style={main}>
        <Container style={card}>
          <Section style={header}>
            <Text style={eyebrow}>{appName}</Text>
            <Heading style={h1}>Verify your email</Heading>
            <Text style={body}>
              Use this code to confirm <strong style={strong}>{handle}</strong> and lock in your spot on the
              waitlist.
            </Text>
          </Section>
          <Section style={codeBoxOuter}>
            <Section style={codeBoxInner}>
              <Text style={codeLabel}>Your code</Text>
              <Text style={codeDigits}>{code}</Text>
            </Section>
            <Text style={finePrint}>
              This code expires in <strong style={strongMuted}>{expiresMinutes} minutes</strong>. If you did not
              request this, you can safely ignore this email.
            </Text>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              {appUrl ? (
                <>
                  This message was sent by {appName}.{' '}
                  <Link href={appUrl} style={link}>
                    {host}
                  </Link>
                </>
              ) : (
                <>Sent by {appName}.</>
              )}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main: React.CSSProperties = {
  backgroundColor: '#f4f4f5',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  margin: 0,
  padding: '32px 16px',
};

const card: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e4e4e7',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  margin: '0 auto',
  maxWidth: '480px',
  padding: 0,
};

const header: React.CSSProperties = {
  padding: '28px 28px 8px 28px',
};

const eyebrow: React.CSSProperties = {
  color: '#71717a',
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '0.02em',
  margin: 0,
  textTransform: 'uppercase',
};

const h1: React.CSSProperties = {
  color: '#18181b',
  fontSize: '22px',
  fontWeight: 600,
  lineHeight: 1.3,
  margin: '12px 0 0 0',
};

const body: React.CSSProperties = {
  color: '#52525b',
  fontSize: '15px',
  lineHeight: 1.5,
  margin: '12px 0 0 0',
};

const strong: React.CSSProperties = { color: '#18181b' };
const strongMuted: React.CSSProperties = { color: '#52525b' };

const codeBoxOuter: React.CSSProperties = {
  padding: '8px 28px 24px 28px',
};

const codeBoxInner: React.CSSProperties = {
  backgroundColor: '#fafafa',
  border: '1px dashed #d4d4d8',
  borderRadius: '8px',
  padding: '20px 16px',
  textAlign: 'center',
};

const codeLabel: React.CSSProperties = {
  color: '#71717a',
  fontSize: '12px',
  fontWeight: 500,
  letterSpacing: '0.06em',
  margin: '0 0 8px 0',
  textTransform: 'uppercase',
};

const codeDigits: React.CSSProperties = {
  color: '#18181b',
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  fontSize: '32px',
  fontWeight: 700,
  letterSpacing: '0.35em',
  margin: 0,
};

const finePrint: React.CSSProperties = {
  color: '#71717a',
  fontSize: '13px',
  lineHeight: 1.5,
  margin: '16px 0 0 0',
};

const footer: React.CSSProperties = {
  borderTop: '1px solid #f4f4f5',
  padding: '0 28px 28px 28px',
};

const footerText: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '12px',
  lineHeight: 1.5,
  margin: '20px 0 0 0',
};

const link: React.CSSProperties = {
  color: '#737373',
  textDecoration: 'underline',
};
