// Datos del artista — única fuente de verdad. Casi todo el sitio lee de aquí.
export const site = {
  nombre: "Abner Gómez",
  marca: "abnergomezart",
  tagline: "Retratos originales",
  descripcion:
    "Retratos originales en grafito, carboncillo y óleo por Abner Gómez. Obras disponibles con marco a elección y retratos por encargo vía WhatsApp.",

  // WhatsApp: SOLO dígitos, formato internacional, sin "+" ni espacios.
  // México: 52 + 10 dígitos → "522461234567".
  // TODO: reemplazar por el número real antes de publicar.
  whatsapp: "520000000000",

  instagram: "@abnergomezart",
  instagramLink: "https://www.instagram.com/abnergomezart/",
  email: "hola@abnergomezart.com",

  // Moneda de los precios de lib/obras.ts
  moneda: "MXN",
  locale: "es-MX",

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://abnergomezart.com",

  // Google Analytics 4. Vacío = sin analytics (el sitio funciona igual).
  gaId: "",
} as const;

export const waLink = (texto: string) =>
  `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(texto)}`;

export const waGeneral = waLink(`Hola ${site.nombre.split(" ")[0]}, vi tu página y tengo una pregunta.`);
