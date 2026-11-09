import type { Metadata, Viewport } from "next";
import { Cormorant, Jost } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import WhatsAppTracking from "@/components/WhatsAppTracking";

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const titulo = `${site.nombre} · ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: titulo, template: `%s · ${site.nombre}` },
  description: site.descripcion,
  keywords: ["retratos por encargo", "retrato a lápiz", "retrato al óleo", "arte original", "cuadros con marco", site.nombre],
  openGraph: {
    type: "website",
    locale: "es_MX",
    title: titulo,
    description: site.descripcion,
    siteName: site.marca,
    url: site.url,
  },
  twitter: { card: "summary_large_image", title: titulo, description: site.descripcion },
  alternates: { canonical: site.url },
};

export const viewport: Viewport = {
  themeColor: "#f3efe7",
  width: "device-width",
  initialScale: 1,
  // Sin viewport-fit: "cover" a propósito (ver xamigua-web): evita que el
  // header fijo se mueva cuando Chrome Android oculta su barra.
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.nombre,
  jobTitle: "Artista retratista",
  url: site.url,
  sameAs: [site.instagramLink],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jost.variable} overflow-x-clip`}>
      <body className="overflow-x-clip">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <GoogleAnalytics />
        <WhatsAppTracking />
        {children}
      </body>
    </html>
  );
}
