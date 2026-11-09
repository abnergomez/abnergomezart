// Catálogo de obras y opciones de marco.
// Para agregar una obra: sube la foto a public/obras/ y añade un objeto a `obras`.

export type Estado = "disponible" | "reservada" | "vendida";
export type Tecnica = "grafito" | "carboncillo" | "oleo";

export type Obra = {
  id: string; // se usa en la URL: abnergomezart.com/#obra/<id>
  titulo: string;
  anio: number;
  tecnica: Tecnica;
  soporte: string; // "Grafito sobre papel algodón"
  ancho: number; // cm
  alto: number; // cm
  precio: number; // en site.moneda
  estado: Estado;
  imagen: string; // ruta en /public. Recomendado JPG/WebP ~1600 px lado largo
  descripcion?: string;
  destacada?: boolean; // aparece en la portada
};

export type MarcoId = "ninguno" | "negro" | "roble" | "dorado";
export type Marco = {
  id: MarcoId;
  nombre: string;
  detalle: string;
  porCm: number; // precio por cm de perímetro de la obra
};

// Precio del marco = perímetro (cm) × porCm, con un mínimo. Así un marco para
// 50×70 cuesta más que uno para 21×30, sin tener que capturar precios a mano.
export const marcos: Marco[] = [
  { id: "ninguno", nombre: "Sin marco", detalle: "Enviada en carpeta rígida", porCm: 0 },
  { id: "negro", nombre: "Negro mate", detalle: "Madera sólida · perfil 2 cm", porCm: 6 },
  { id: "roble", nombre: "Roble natural", detalle: "Veta visible · perfil 2.5 cm", porCm: 7 },
  { id: "dorado", nombre: "Dorado antiguo", detalle: "Pan de oro envejecido · perfil 3 cm", porCm: 9.5 },
];
export const marcoMinimo = 650;
// Paspartú de algodón libre de ácido (solo con marco)
export const paspartuPorCm = 1.8;

export const tecnicas: { id: Tecnica | "todas"; nombre: string }[] = [
  { id: "todas", nombre: "Todas" },
  { id: "grafito", nombre: "Grafito" },
  { id: "carboncillo", nombre: "Carboncillo" },
  { id: "oleo", nombre: "Óleo" },
];

// TODO: reemplazar por las obras reales (las imágenes actuales son provisionales).
export const obras: Obra[] = [
  {
    id: "luz-de-tarde", titulo: "Luz de tarde", anio: 2025, tecnica: "grafito",
    soporte: "Grafito sobre papel algodón", ancho: 30, alto: 40, precio: 5800,
    estado: "disponible", imagen: "/obras/luz-de-tarde.svg", destacada: true,
    descripcion: "Estudio de luz lateral, construido en capas finas de grafito 2H a 8B.",
  },
  {
    id: "la-espera", titulo: "La espera", anio: 2025, tecnica: "carboncillo",
    soporte: "Carboncillo y tiza blanca", ancho: 50, alto: 65, precio: 9800,
    estado: "disponible", imagen: "/obras/la-espera.svg",
    descripcion: "Carboncillo vegetal sobre papel tonado; los blancos están levantados con tiza.",
  },
  {
    id: "abuela-rosa", titulo: "Abuela Rosa", anio: 2024, tecnica: "oleo",
    soporte: "Óleo sobre lienzo", ancho: 40, alto: 50, precio: 16000,
    estado: "vendida", imagen: "/obras/abuela-rosa.svg",
    descripcion: "Retrato por encargo. Paleta limitada de tierras y blanco de titanio.",
  },
  {
    id: "mirada-norte", titulo: "Mirada norte", anio: 2025, tecnica: "grafito",
    soporte: "Grafito sobre papel algodón", ancho: 21, alto: 29.7, precio: 3800,
    estado: "disponible", imagen: "/obras/mirada-norte.svg",
    descripcion: "Formato íntimo. Ideal para escritorio o pared pequeña.",
  },
  {
    id: "silencio", titulo: "Silencio", anio: 2024, tecnica: "carboncillo",
    soporte: "Carboncillo sobre papel", ancho: 45, alto: 45, precio: 8200,
    estado: "reservada", imagen: "/obras/silencio.svg",
    descripcion: "Composición cuadrada; el fondo se resolvió con difuminado amplio.",
  },
  {
    id: "retrato-en-ocre", titulo: "Retrato en ocre", anio: 2025, tecnica: "oleo",
    soporte: "Óleo sobre tabla", ancho: 30, alto: 40, precio: 13500,
    estado: "disponible", imagen: "/obras/retrato-en-ocre.svg",
    descripcion: "Pintado alla prima en una sola sesión con modelo.",
  },
  {
    id: "perfil-i", titulo: "Perfil I", anio: 2025, tecnica: "grafito",
    soporte: "Grafito sobre papel", ancho: 25, alto: 35, precio: 4600,
    estado: "disponible", imagen: "/obras/perfil-i.svg",
    descripcion: "Primera pieza de una serie de perfiles con luz cenital.",
  },
  {
    id: "manos-de-taller", titulo: "Manos de taller", anio: 2024, tecnica: "carboncillo",
    soporte: "Carboncillo y sanguina", ancho: 50, alto: 35, precio: 7400,
    estado: "disponible", imagen: "/obras/manos-de-taller.svg",
    descripcion: "Formato horizontal. Sanguina para los medios tonos cálidos.",
  },
];
