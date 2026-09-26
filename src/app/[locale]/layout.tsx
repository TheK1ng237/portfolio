import type { Metadata } from 'next';
import Script from 'next/script';
import Footer from './component/FOOTER';
import LogoIntro from './component/LogoIntro';
import Navigation from './component/NAV';
import BackgroundCanvas from './component/BackgroundCanvas';
import CustomCursor from './component/CustomCursor';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  metadataBase: new URL('https://kingtang.vercel.app'),
  title: {
    default: 'KingTang Portfolio | Full-Stack Developer',
    template: '%s | KingTang',
  },
  description: "Portfolio Afro-Futuriste de KingTang, développeur full-stack. Applications web, API, bases de données et expériences numériques immersives.",
  keywords: ['Full-Stack Developer', 'Next.js', 'Angular', 'Node.js', 'Django', 'Portfolio', 'KingTang', 'Afro-Futurism'],
  authors: [{ name: 'KingTang' }],
  creator: 'KingTang',

  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://kingtang.vercel.app',
    title: 'KingTang | Full-Stack Developer',
    description: "Interfaces immersives de haute précision, ingénierie web moderne et héritage culturel.",
    siteName: 'KingTang Portfolio',
    images: [
      {
        url: '/mascote.png',
        width: 1200,
        height: 630,
        alt: 'Aperçu du Portfolio de KingTang',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'KingTang | Full-Stack Developer',
    description: 'Full-Stack Developer passionate about immersive digital experiences.',
    images: ['/mascote.png'],
    creator: '@mfalme369',
  },

  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'KingTang',
  url: 'https://kingtang.vercel.app',
  jobTitle: 'Full-Stack Developer',
  description: 'Créateur d’expériences numériques immersives et innovateur culturel.',
  sameAs: [
    'https://github.com/TangB5',
    'https://linkedin.com/in/ndoh-yannick-tang-5b004934a',
    'https://instagram.com/kingtang337'
  ],
  knowsAbout: ['React', 'Next.js', 'UX Design', 'Creative Coding', 'Tailwind CSS', 'Fullstack Engineering'],
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "fr" | "en")) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="dark">
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(jsonLd)}
        </Script>
      </head>
      <body className="bg-[#050508] text-[#F5F5DC] antialiased min-h-screen flex flex-col selection:bg-[#E9B826] selection:text-black">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <CustomCursor />
          <BackgroundCanvas />
          <Navigation />
          <LogoIntro />

          <main className="flex-grow z-10 relative">
            {children}
          </main>

          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}