import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lowkey — Drops, not noise.',
  description: 'A new drop-style streetwear label. Join the waitlist.',
  keywords: ['streetwear', 'drops', 'limited', 'fashion', 'waitlist'],
  authors: [{ name: 'Lowkey' }],
  openGraph: {
    title: 'Lowkey — Drops, not noise.',
    description: 'A new drop-style streetwear label. Join the waitlist.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lowkey — Drops, not noise.',
    description: 'A new drop-style streetwear label. Join the waitlist.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}