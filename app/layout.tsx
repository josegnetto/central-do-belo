import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { getSiteUrl } from "@/lib/seo";

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
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
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
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
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
    // fallback para páginas sem imagem própria (home, categorias, institucionais)
    images: [{ url: "/logobelo.png" }],
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
  // Preconnect ao Supabase Storage: economiza o handshake DNS/TLS antes do
  // navegador pedir a primeira imagem de capa.
  const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL || null;

  return (
    <html lang="pt-BR" className={`${inter.variable} ${lora.variable} h-full`}>
      <head>
        {supabaseOrigin ? <link rel="preconnect" href={supabaseOrigin} crossOrigin="" /> : null}
        {/* Preconnect adianta o handshake DNS/TLS dos scripts de anúncio/analytics,
            que costumam ser o maior peso de rede fora do próprio site. */}
        {adsenseClientId ? (
          <>
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
            <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
          </>
        ) : null}
        {gaId || gaMeasurementId ? (
          <link rel="preconnect" href="https://www.googletagmanager.com" />
        ) : null}
        {adsenseClientId ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        ) : null}
        {gaMeasurementId ? (
          <>
            {/* Google tag (gtag.js) */}
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        ) : null}
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink antialiased">
        {children}
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
