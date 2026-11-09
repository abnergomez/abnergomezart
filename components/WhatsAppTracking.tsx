"use client";

import { useEffect } from "react";

// Declaración mínima de gtag en window para TypeScript. gtag.js lo define en
// runtime (ver GoogleAnalytics.tsx); aquí solo lo tipamos para poder llamarlo.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Dispara un evento GA4 cada vez que alguien hace clic en un enlace de
// WhatsApp, para que ese clic se vea reflejado en GA4 y — por lo tanto — en
// el reporte de Looker Studio (Data Studio), que lee de GA4.
//
// Usa un listener DELEGADO sobre todo el documento en lugar de un `onClick`
// por enlace: los enlaces de WhatsApp están en muchos componentes (Hero, Nav,
// Reserva, Ubicación, Menú, Footer y el botón flotante) y algunos son server
// components donde no se puede poner un handler. Un solo listener los cubre
// todos, incluidos los que se agreguen en el futuro.
export default function WhatsAppTracking() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      // El clic puede caer sobre un ícono/texto dentro del <a>; subimos al
      // ancla más cercana.
      const anchor = target?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      // Cubre wa.me, api.whatsapp.com y web.whatsapp.com.
      if (!/wa\.me|whatsapp\.com/i.test(href)) return;

      // Origen del clic: sección donde vive el enlace, para poder distinguir
      // en el reporte qué botón convierte más (hero, nav, reserva, etc.).
      const section = anchor.closest("[id]")?.id || undefined;
      const label =
        anchor.getAttribute("aria-label") ||
        anchor.textContent?.trim() ||
        undefined;

      window.gtag?.("event", "whatsapp_click", {
        link_url: href,
        link_domain: "wa.me",
        link_location: section,
        link_text: label,
        // Marca el evento como interacción "de valor" (no rebote) para que
        // GA4 lo cuente como sesión con interacción.
        engagement: true,
      });
    }

    // `capture: true` para registrar el clic aunque otro handler haga
    // stopPropagation antes de que burbujee.
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
