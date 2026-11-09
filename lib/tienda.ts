// Precios, formato y mensajes de WhatsApp. Funciones puras (sin React).
import { site } from "./site";
import { marcos, marcoMinimo, obras, paspartuPorCm, type MarcoId, type Obra, type Estado } from "./obras";

export type Item = { id: string; marco: MarcoId; paspartu: boolean };

export const obraPorId = new Map(obras.map((o) => [o.id, o]));
export const marcoPorId = new Map(marcos.map((m) => [m.id, m]));

export const etiquetaEstado: Record<Estado, string> = {
  disponible: "Disponible",
  reservada: "Reservada",
  vendida: "Vendida",
};

const fmt = new Intl.NumberFormat(site.locale, {
  style: "currency",
  currency: site.moneda,
  maximumFractionDigits: 0,
});
export const dinero = (n: number) => fmt.format(n);

const num = (n: number) => String(n).replace(".", ",");
export const medidas = (o: Pick<Obra, "ancho" | "alto">) => `${num(o.ancho)} × ${num(o.alto)} cm`;
const perimetro = (o: Pick<Obra, "ancho" | "alto">) => 2 * (o.ancho + o.alto);

export function precioMarco(o: Pick<Obra, "ancho" | "alto">, marco: MarcoId) {
  const m = marcoPorId.get(marco);
  if (!m || !m.porCm) return 0;
  return Math.max(marcoMinimo, redondea(perimetro(o) * m.porCm));
}
export function precioPaspartu(o: Pick<Obra, "ancho" | "alto">) {
  return redondea(perimetro(o) * paspartuPorCm);
}
export function totalItem(item: Item) {
  const o = obraPorId.get(item.id);
  if (!o) return 0;
  const conMarco = item.marco !== "ninguno";
  return o.precio + precioMarco(o, item.marco) + (conMarco && item.paspartu ? precioPaspartu(o) : 0);
}
// Redondea a decenas para precios "limpios"
const redondea = (n: number) => Math.round(n / 10) * 10;

export const urlObra = (id: string) => `${site.url}/#obra/${id}`;

export function lineaItem(item: Item) {
  const o = obraPorId.get(item.id)!;
  const m = marcoPorId.get(item.marco)!;
  const extra =
    item.marco === "ninguno" ? "Sin marco" : `Marco ${m.nombre.toLowerCase()}${item.paspartu ? " + paspartú" : ""}`;
  return `• ${o.titulo} — ${o.soporte}, ${medidas(o)}\n   ${extra} — ${dinero(totalItem(item))}`;
}

const saludo = `Hola ${site.nombre.split(" ")[0]}`;

export function mensajeObra(o: Obra, item: Item) {
  if (o.estado === "vendida")
    return `${saludo}, vi "${o.titulo}" (vendida) en tu página y me gustaría algo similar por encargo.`;
  if (o.estado === "reservada")
    return `${saludo}, me interesa "${o.titulo}" (reservada). ¿Me avisas si se libera?\n\n${urlObra(o.id)}`;
  return `${saludo}, me interesa esta obra:\n\n${lineaItem(item)}\n\n${urlObra(o.id)}\n\n¿Está disponible?`;
}

export function mensajePedido(items: Item[], ciudad: string) {
  const total = items.reduce((s, i) => s + totalItem(i), 0);
  return (
    `${saludo}, quiero comprar estas obras de tu página:\n\n` +
    items.map(lineaItem).join("\n\n") +
    `\n\nTotal estimado: ${dinero(total)} ${site.moneda}` +
    (ciudad.trim() ? `\nEntrega en: ${ciudad.trim()}` : "") +
    `\n\n¿Me confirmas disponibilidad y costo de envío?`
  );
}

export type Encargo = {
  nombre: string;
  tecnica: string;
  tamano: string;
  personas: string;
  fecha: string; // yyyy-mm-dd o ""
  idea: string;
};

export function mensajeEncargo(e: Encargo) {
  let fecha = "";
  if (e.fecha) {
    const d = new Date(`${e.fecha}T12:00:00`);
    fecha = isNaN(d.getTime())
      ? e.fecha
      : d.toLocaleDateString(site.locale, { day: "numeric", month: "long", year: "numeric" });
  }
  return (
    `${saludo}, soy ${e.nombre.trim()}. Me gustaría un retrato por encargo:\n\n` +
    `• Técnica: ${e.tecnica}\n` +
    `• Tamaño: ${e.tamano}\n` +
    `• Personas: ${e.personas}\n` +
    (fecha ? `• Para el: ${fecha}\n` : "") +
    (e.idea.trim() ? `\nIdea: ${e.idea.trim()}\n` : "") +
    `\nTe envío las fotos por aquí.`
  );
}

// Valida y limpia lo guardado en localStorage (obra eliminada, vendida, datos corruptos)
export function limpiarSeleccion(raw: unknown): Item[] {
  if (!Array.isArray(raw)) return [];
  const vistos = new Set<string>();
  return raw.flatMap((r) => {
    if (!r || typeof r !== "object") return [];
    const { id, marco, paspartu } = r as Record<string, unknown>;
    if (typeof id !== "string" || vistos.has(id)) return [];
    const o = obraPorId.get(id);
    if (!o || o.estado !== "disponible" || !marcoPorId.has(marco as MarcoId)) return [];
    vistos.add(id);
    return [{ id, marco: marco as MarcoId, paspartu: !!paspartu }];
  });
}
