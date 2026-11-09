"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Dir = "up" | "left" | "right" | "none";

const offset: Record<Dir, { x?: number; y?: number }> = {
  up: { y: 26 },
  left: { x: -26 },
  right: { x: 26 },
  none: {},
};

/**
 * Anima una vez al entrar en viewport y ya. `once:false` (animar también
 * al salir) suena bonito en el papel, pero significa que CADA sección de
 * la página vuelve a disparar su animación en CADA cruce del umbral —
 * con ~15 secciones en la página eso satura el hilo principal durante el
 * scroll y hace que el header/botón fixed se vean temblar o saltar en
 * celular. `once:true` corta ese costo de raíz sin perder el efecto de
 * entrada.
 */
export default function Reveal({
  children,
  dir = "up",
  delay = 0,
  className,
  amount = 0.3,
}: {
  children: ReactNode;
  dir?: Dir;
  delay?: number;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();

  // `hidden` no depende de `reduce`: framer-motion serializa `initial` como
  // estilo inline durante el SSR, y `useReducedMotion()` sólo conoce la
  // preferencia real del visitante hasta la hidratación en cliente — si el
  // valor inicial dependiera de `reduce` aquí, el HTML del servidor y el
  // primer render en cliente podrían generar `style` distintos y disparar
  // un mismatch de hidratación. En vez de eso, con reduced motion la
  // transición es instantánea (duration 0) y no hay animación visible.
  const variants: Variants = {
    hidden: { opacity: 0, ...offset[dir] },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: reduce
        ? { duration: 0 }
        : { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}
