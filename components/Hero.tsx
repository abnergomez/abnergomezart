"use client";

import { motion, useReducedMotion } from "framer-motion";
import { obras } from "@/lib/obras";
import { medidas } from "@/lib/tienda";
import Marco from "./Marco";
import { useTienda } from "./Tienda";

const destacada =
  obras.find((o) => o.destacada && o.estado !== "vendida") ?? obras.find((o) => o.estado === "disponible") ?? obras[0];

export default function Hero() {
  const { abrirObra } = useTienda();
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const t = (delay: number) => (reduce ? { duration: 0 } : { duration: 1, delay, ease });

  return (
    <section className="hero" id="inicio">
      <div>
        <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t(0.1)}>
          Retrato contemporáneo · Obra original
        </motion.p>
        <h1 className="hero__title">
          <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
            El rostro
          </motion.span>
          <motion.em initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
            como paisaje
          </motion.em>
        </h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t(0.5)}>
          <p className="hero__lede">
            Piezas únicas en grafito, carboncillo y óleo. Elige tu obra, su marco, y la coordinamos por WhatsApp.
          </p>
          <div className="hero__cta">
            <a className="btn btn--ink" href="#galeria">Ver obra disponible</a>
            <a className="btn btn--line" href="#encargos">Pedir un retrato</a>
          </div>
        </motion.div>
      </div>

      {destacada && (
        <motion.button
          type="button"
          className="hero__art"
          onClick={() => abrirObra(destacada.id)}
          aria-label={`Ver ${destacada.titulo}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.35)}
        >
          <Marco obra={destacada} marco="roble" paspartu />
          <span className="hero__cap">
            <i>{destacada.titulo}</i>
            <span>{destacada.soporte.split(" sobre ")[0]} · {medidas(destacada)}</span>
          </span>
        </motion.button>
      )}
      <a className="hero__scroll" href="#galeria" aria-label="Bajar a la galería"><span /></a>
    </section>
  );
}
