import type { Metadata } from "next";
import Script from "next/script";
import Footer from "./component/FOOTER";
import LogoIntro from "./component/LogoIntro";
import Navigation from "./component/NAV";
import BackgroundCanvas from "./component/BackgroundCanvas";
import CustomCursor from "./component/CustomCursor";
import SiteChrome from "./component/SiteChrome";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages, getTranslations } from "next-intl/server";
import "primeicons/primeicons.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL("https://Thek1ng237.vercel.app"),
    title: {
      default: title,
      template: "%s | Thek1ng237",
    },
    description,
    keywords: t.raw("keywords") as string[],
    authors: [{ name: "Thek1ng237" }],
    creator: "Thek1ng237",
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: `https://Thek1ng237.vercel.app/${locale}`,
      title,
      description: t("social_description"),
      siteName: "Thek1ng237 Portfolio",
      images: [
        {
          url: "/mascote.png",
          width: 1200,
          height: 630,
          alt: t("image_alt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: t("twitter_description"),
      images: ["/mascote.png"],
      creator: "@mfalme369",
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Thek1ng237",
  url: "https://Thek1ng237.vercel.app",
  jobTitle: "Full-Stack Developer",
  description:
    "Créateur d’expériences numériques immersives et innovateur culturel.",
  sameAs: [
    "https://github.com/TangB5",
    "https://linkedin.com/in/ndoh-yannick-tang-5b004934a",
    "https://instagram.com/Thek1ng237337",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "UX Design",
    "Creative Coding",
    "Tailwind CSS",
    "Fullstack Engineering",
  ],
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
  const metadataT = await getTranslations({ locale, namespace: "Metadata" });

  return (
    <html lang={locale} className="dark">
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({ ...jsonLd, description: metadataT("person_description") })}
        </Script>
      </head>
      <body className="bg-[#050508] text-[#F5F5DC] antialiased min-h-screen flex flex-col selection:bg-[#E9B826] selection:text-black">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SiteChrome
            decorations={
              <>
                <CustomCursor />
                <BackgroundCanvas />
                <LogoIntro />
              </>
            }
            header={<Navigation />}
            footer={<Footer />}
          >
            {children}
          </SiteChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
