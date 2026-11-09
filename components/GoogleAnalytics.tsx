import Script from "next/script";
import { site } from "@/lib/site";

// Solo se carga si hay un ID en lib/site.ts (gaId).
export default function GoogleAnalytics() {
  if (!site.gaId) return null;
  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.gaId}');`}
      </Script>
    </>
  );
}
