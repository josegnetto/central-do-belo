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
const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION;
const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

// Modo escuro é o padrão do site; só aplicamos "light" quando o usuário escolheu explicitamente.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    document.documentElement.dataset.theme = stored === "light" ? "light" : "dark";
  } catch (e) {}
})();
`;

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
    <html
      lang="pt-BR"
      className={`${inter.variable} ${lora.variable} h-full`}
      suppressHydrationWarning
    >
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
        {gaId ? <link rel="preconnect" href="https://www.googletagmanager.com" /> : null}
        {adsenseClientId ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        {children}
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
