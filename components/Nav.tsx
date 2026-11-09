"use client";

import { Handbag } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { useTienda } from "./Tienda";

const enlaces = [
  { href: "#galeria", label: "Obra" },
  { href: "#encargos", label: "Encargos" },
  { href: "#estudio", label: "Estudio" },
  { href: "#preguntas", label: "Preguntas" },
];

export default function Nav() {
  const { seleccion, abrirSeleccion, pulso } = useTienda();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  const n = seleccion.length;
  return (
    <header className={`topbar${scrolled ? " is-scrolled" : ""}`}>
      <a className="brand" href="#inicio" aria-label={`${site.nombre}, inicio`}>
        <span className="brand__mono" aria-hidden="true">AG</span>
        <span className="brand__name">{site.nombre}</span>
      </a>
      <nav className="nav" aria-label="Principal">
        {enlaces.map((e) => (
          <a key={e.href} href={e.href}>{e.label}</a>
        ))}
      </nav>
      <button
        // key con `pulso`: reinicia la animación cada vez que se agrega una obra
        key={pulso}
        className={`bag-btn${pulso ? " bump" : ""}`}
        type="button"
        onClick={abrirSeleccion}
        aria-label={`Abrir mi selección, ${n} ${n === 1 ? "obra" : "obras"}`}
      >
        <Handbag size={24} weight="light" aria-hidden="true" />
        {n > 0 && <span className="bag-btn__count">{n}</span>}
      </button>
    </header>
  );
}
