"use client";

import { useState } from "react";
import { obras, tecnicas, type Tecnica } from "@/lib/obras";
import { dinero, etiquetaEstado, medidas } from "@/lib/tienda";
import Reveal from "./Reveal";
import { useTienda } from "./Tienda";

const orden = { disponible: 0, reservada: 1, vendida: 2 } as const;

export default function Galeria() {
  const { abrirObra } = useTienda();
  const [filtro, setFiltro] = useState<Tecnica | "todas">("todas");
  const lista = obras
    .filter((o) => filtro === "todas" || o.tecnica === filtro)
    .toSorted((a, b) => orden[a.estado] - orden[b.estado]);

  return (
    <section className="section" id="galeria" aria-labelledby="galeria-titulo">
      <header className="section__head">
        <p className="eyebrow">I — Colección</p>
        <h2 id="galeria-titulo" className="section__title">Obra disponible</h2>
        <p className="section__note">Toca una pieza para verla con marco.</p>
      </header>

      <div className="filters" role="toolbar" aria-label="Filtrar por técnica">
        {tecnicas.map((t) => {
          const n = t.id === "todas" ? obras.length : obras.filter((o) => o.tecnica === t.id).length;
          if (!n) return null;
          return (
            <button key={t.id} type="button" className="chip" aria-pressed={filtro === t.id} onClick={() => setFiltro(t.id)}>
              {t.nombre}<sup>{n}</sup>
            </button>
          );
        })}
      </div>

      <div className="galeria-grid">
        {lista.map((o, i) => (
          <Reveal key={`${filtro}-${o.id}`} className="card-wrap" delay={(i % 4) * 0.07} amount={0.15}>
            <button
              type="button"
              className={`card${o.estado === "vendida" ? " is-sold" : ""}`}
              onClick={() => abrirObra(o.id)}
              aria-label={`${o.titulo}, ${etiquetaEstado[o.estado]}, ${dinero(o.precio)}`}
            >
              <span className="card__media">
                {o.estado !== "disponible" && <span className="card__tag">{etiquetaEstado[o.estado]}</span>}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={o.imagen}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={1000}
                  height={Math.round((1000 * o.alto) / o.ancho)}
                />
              </span>
              <span className="card__info">
                <span className="card__title">{o.titulo}</span>
                <span className="card__meta">
                  {o.soporte}
                  <br />
                  {medidas(o)} · {o.anio}
                </span>
                <span className="card__price">{dinero(o.precio)}</span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
