import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from '../config';

import './global.css';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';

import { NextUIProvider } from '@nextui-org/react';
import { Alegreya } from 'next/font/google';

const alegreya = Alegreya({
  subsets: ['latin'],
  variable: '--font-alegreya',
  display: 'swap',
});

const OnchainProviders = dynamic(
  () => import('src/components/OnchainProviders'),
  {
    ssr: false,
  },
);

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: 'ENSuite',
  description: 'Revolutionizing corporate spending management.',
  openGraph: {
    title: 'ENSuite',
    description: 'Built by Alibuda Lab',
    images: [`${NEXT_PUBLIC_URL}/imgs/ENSuiteLogo.png`],
  },
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${alegreya.variable}`}>
      <Toaster />
      <body className="flex items-center justify-center">
        <NextUIProvider>
          <OnchainProviders>{children}</OnchainProviders>
        </NextUIProvider>
      </body>
    </html>
  );
}
