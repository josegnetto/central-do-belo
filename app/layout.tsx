import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { buildOrganizationJsonLd, buildWebSiteJsonLd, getSiteUrl } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION;
const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  verification: gscVerification ? { google: gscVerification } : undefined,
  // Meta tag oficial de verificação de propriedade do AdSense. É por ela que o
  // Google confirma que o site é seu quando você o adiciona em "Sites"; sem
  // ela (ou sem o snippet no <head>) a análise fica presa em "Requer atenção".
  other: adsenseClientId ? { "google-adsense-account": adsenseClientId } : undefined,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${lora.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-paper text-ink antialiased">
        {/* Identidade do veículo para o Google (quem publica, como falar com a redação). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebSiteJsonLd()) }}
        />

        {/* Snippet do AdSense. Scripts `async` são içados para o <head> pelo React,
            que é onde o Google exige encontrá-lo para verificar e analisar o site. */}
        {adsenseClientId ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        ) : null}

        {children}
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
