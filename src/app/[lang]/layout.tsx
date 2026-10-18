import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { IBM_Plex_Sans, Jersey_10 } from "next/font/google";
import { CoinGame } from "@/components/game/CoinGame";
import { PixelScene } from "@/components/scene/PixelScene";
import { getContent } from "@/content";
import { githubUrl, person } from "@/content/profile";
import { hasLocale, htmlLang, locales, ogLocale, otherLocale } from "@/i18n/config";
import { siteUrl } from "@/lib/site";
import "../globals.css";

// Pixel display font
const pixelFont = Jersey_10({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
  display: "swap",
});

const sansFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getContent(lang);

  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: person.name, url: githubUrl }],
    creator: person.name,
    alternates: {
      canonical: `/${lang}`,
      languages: { "pt-BR": "/pt", en: "/en", "x-default": "/pt" },
    },
    openGraph: {
      type: "profile",
      firstName: person.givenName,
      lastName: person.familyName,
      title: meta.title,
      description: meta.description,
      url: `/${lang}`,
      siteName: person.name,
      locale: ogLocale[lang],
      alternateLocale: ogLocale[otherLocale(lang)],
      images: [{ url: `/${lang}/og.png`, width: 1200, height: 630, alt: person.name }],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#7ab3f0",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={htmlLang[lang]} className={`${pixelFont.variable} ${sansFont.variable}`}>
      <body>
        <PixelScene />
        {children}
        <CoinGame />
      </body>
    </html>
  );
}
