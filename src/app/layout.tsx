import { Footer } from '@/components/footer';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './directory.css';
import { AppHeader } from '@/components/app-header';
import { productConfig } from '@/lib/config/product';
import { siteOrigin } from '@/lib/config/origin';

const geist = Geist({ variable: '--font-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: `${productConfig.name} | Namma Startup`,
  description:
    'Explore real companies, careers, and startup news across Chennai. Browse the map and help grow the directory.',
  openGraph: {
    title: 'Chennai Startup Map',
    description: 'Discover the companies building Chennai.',
    url: siteOrigin(),
    siteName: 'Namma Startup',
    type: 'website',
    images: [
      {
        url: `${siteOrigin()}/og.png`,
        width: 1730,
        height: 909,
        alt: 'Chennai Startup Map — Discover the companies building Chennai.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chennai Startup Map',
    description: 'Discover the companies building Chennai.',
    images: [`${siteOrigin()}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <AppHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
