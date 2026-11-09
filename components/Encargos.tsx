"use client";

import { WhatsappLogo } from "@phosphor-icons/react";
import { useRef, useState, type FormEvent } from "react";
import { waLink } from "@/lib/site";
import { mensajeEncargo, type Encargo } from "@/lib/tienda";
import Reveal from "./Reveal";

const pasos = [
  { t: "Cuéntame", d: "Envía tus fotos y la idea. Te respondo con propuesta y presupuesto." },
  { t: "Boceto", d: "Con un anticipo del 50 % preparo un boceto para aprobar el encuadre." },
  { t: "Entrega", d: "Avances por WhatsApp y entrega enmarcada o enrollada, a tu elección." },
];

const hoyISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export default function Encargos() {
  const [f, setF] = useState<Encargo>({
    nombre: "", tecnica: "Grafito", tamano: "30 × 40 cm", personas: "1", fecha: "", idea: "",
  });
  const [error, setError] = useState<{ campo: "nombre" | "fecha"; msg: string } | null>(null);
  const nombreRef = useRef<HTMLInputElement>(null);
  const fechaRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof Encargo>(k: K, v: Encargo[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    if (error?.campo === k) setError(null);
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!f.nombre.trim()) {
      setError({ campo: "nombre", msg: "Escribe tu nombre para poder saludarte." });
      nombreRef.current?.focus();
      return;
    }
    if (f.fecha && f.fecha < hoyISO()) {
      setError({ campo: "fecha", msg: "La fecha debe ser hoy o posterior." });
      fechaRef.current?.focus();
      return;
    }
    setError(null);
    const url = waLink(mensajeEncargo(f));
    window.gtag?.("event", "whatsapp_click", { link_url: url, link_location: "encargos", link_text: "Solicitud de encargo" });
    // window.open con "noopener" siempre devuelve null, así que se anula opener a mano
    const w = window.open(url, "_blank");
    if (w) w.opener = null;
    else location.href = url; // ventana bloqueada: abrir en la misma pestaña
  };

  return (
    <section className="section commission" id="encargos" aria-labelledby="encargos-titulo">
      <header className="section__head">
        <p className="eyebrow">III — Por encargo</p>
        <h2 id="encargos-titulo" className="section__title">Tu retrato, <em>a mano</em></h2>
      </header>

      <ol className="steps">
        {pasos.map((p, i) => (
          <li key={p.t}>
            <span className="steps__n">0{i + 1}</span>
            <h3>{p.t}</h3>
            <p>{p.d}</p>
          </li>
        ))}
      </ol>

      <Reveal amount={0.1}>
        <form className="cform" onSubmit={enviar} noValidate>
          <fieldset>
            <legend className="label">Técnica</legend>
            <div className="seg">
              {["Grafito", "Carboncillo", "Óleo"].map((t) => (
                <label key={t}>
                  <input type="radio" name="tecnica" value={t} checked={f.tecnica === t} onChange={() => set("tecnica", t)} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="cform__row">
            <label className="field">
              <span className="label">Tamaño</span>
              <select value={f.tamano} onChange={(e) => set("tamano", e.target.value)}>
                {["21 × 30 cm", "30 × 40 cm", "40 × 50 cm", "50 × 70 cm", "No estoy seguro"].map((x) => <option key={x}>{x}</option>)}
              </select>
            </label>
            <label className="field">
              <span className="label">Personas</span>
              <select value={f.personas} onChange={(e) => set("personas", e.target.value)}>
                {["1", "2", "3", "4 o más", "Mascota"].map((x) => <option key={x}>{x}</option>)}
              </select>
            </label>
          </div>

          <div className="cform__row">
            <label className="field">
              <span className="label">Tu nombre</span>
              <input
                ref={nombreRef}
                name="nombre"
                type="text"
                autoComplete="name"
                placeholder="Nombre"
                maxLength={80}
                value={f.nombre}
                onChange={(e) => set("nombre", e.target.value)}
                aria-invalid={error?.campo === "nombre"}
                aria-describedby={error?.campo === "nombre" ? "cform-error" : undefined}
              />
            </label>
            <label className="field">
              <span className="label">¿Para cuándo?</span>
              <input
                ref={fechaRef}
                name="fecha"
                type="date"
                min={hoyISO()}
                value={f.fecha}
                onChange={(e) => set("fecha", e.target.value)}
                aria-invalid={error?.campo === "fecha"}
                aria-describedby={error?.campo === "fecha" ? "cform-error" : undefined}
              />
            </label>
          </div>

          <label className="field">
            <span className="label">Idea o detalles <small>(opcional)</small></span>
            <textarea
              rows={3}
              maxLength={600}
              placeholder="Es un regalo de aniversario, me gustaría fondo cálido…"
              value={f.idea}
              onChange={(e) => set("idea", e.target.value)}
            />
          </label>

          {error && <p className="cform__error" id="cform-error" role="alert">{error.msg}</p>}
          <button className="btn btn--wa btn--block" type="submit">
            <WhatsappLogo size={20} weight="fill" aria-hidden="true" />
            Enviar solicitud por WhatsApp
          </button>
          <p className="cform__hint">Las fotos se envían directamente en el chat.</p>
        </form>
      </Reveal>
    </section>
  );
}
