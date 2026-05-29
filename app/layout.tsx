import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Get Intro — Smart Networking OS',
  description: 'Inbound request management + AI-powered introductions in one platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
