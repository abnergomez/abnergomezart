"use client";

import { X } from "@phosphor-icons/react";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Panel modal sobre <dialog>: bottom-sheet en móvil, panel lateral en escritorio.
 * <dialog> + showModal() da gratis el foco atrapado, Escape y `inert` del fondo.
 * Aquí se añade: cierre animado, tocar el fondo para cerrar y deslizar hacia
 * abajo para cerrar en móvil.
 */
export default function Sheet({
  open,
  onClose,
  labelledBy,
  className = "",
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const unlock = () => {
      if (!document.querySelector("dialog[open]")) document.body.classList.remove("is-locked");
    };

    if (open) {
      d.classList.remove("is-closing");
      d.style.transform = "";
      if (!d.open) {
        d.showModal();
        innerRef.current?.scrollTo(0, 0);
        d.querySelectorAll<HTMLElement>(".sheet__body").forEach((b) => b.scrollTo(0, 0));
      }
      document.body.classList.add("is-locked");
      return;
    }
    if (!d.open) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hecho = false;
    const terminar = () => {
      if (hecho) return;
      hecho = true;
      d.removeEventListener("animationend", onEnd);
      d.classList.remove("is-closing");
      d.style.transform = "";
      d.close();
      unlock();
    };
    const onEnd = (e: AnimationEvent) => e.target === d && terminar();
    if (reduce) {
      terminar();
      return;
    }
    d.classList.add("is-closing");
    d.addEventListener("animationend", onEnd);
    const t = setTimeout(terminar, 420); // por si la animación no dispara
    return () => {
      clearTimeout(t);
      d.removeEventListener("animationend", onEnd);
    };
  }, [open]);

  // Si el componente se desmonta con el diálogo abierto, liberar el scroll
  useEffect(() => () => document.body.classList.remove("is-locked"), []);

  // Deslizar hacia abajo para cerrar (móvil; solo si el contenido está arriba)
  useEffect(() => {
    const d = ref.current;
    const inner = innerRef.current;
    if (!d || !inner) return;
    let y0 = 0;
    let dy = 0;
    let activo = false;
    const start = (e: TouchEvent) => {
      if (window.innerWidth >= 1024 || inner.scrollTop > 0) return;
      if ((e.target as HTMLElement).closest("input, select, textarea, [role=radiogroup]")) return;
      y0 = e.touches[0].clientY;
      dy = 0;
      activo = true;
    };
    const move = (e: TouchEvent) => {
      if (!activo) return;
      dy = Math.max(0, e.touches[0].clientY - y0);
      if (inner.scrollTop <= 0) d.style.transform = dy ? `translateY(${dy}px)` : "";
    };
    const end = () => {
      if (!activo) return;
      activo = false;
      if (dy > 110) {
        onCloseRef.current(); // la animación de cierre parte de la posición actual
      } else if (dy > 0) {
        d.style.transition = "transform .3s cubic-bezier(.2,.7,.1,1)";
        d.style.transform = "";
        setTimeout(() => (d.style.transition = ""), 300);
      }
    };
    d.addEventListener("touchstart", start, { passive: true });
    d.addEventListener("touchmove", move, { passive: true });
    d.addEventListener("touchend", end);
    d.addEventListener("touchcancel", end);
    return () => {
      d.removeEventListener("touchstart", start);
      d.removeEventListener("touchmove", move);
      d.removeEventListener("touchend", end);
      d.removeEventListener("touchcancel", end);
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className={`sheet ${className}`}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault(); // Escape: cierre animado en vez del cierre seco nativo
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // clic en el fondo
      }}
    >
      <div className="sheet__inner" ref={innerRef}>
        <button className="sheet__close" type="button" onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>
        <span className="sheet__grip" aria-hidden="true" />
        {children}
      </div>
    </dialog>
  );
}
