"use client";

import { WhatsappLogo } from "@phosphor-icons/react";
import { useState, type KeyboardEvent } from "react";
import { marcos, tecnicas, type MarcoId } from "@/lib/obras";
import { site, waLink } from "@/lib/site";
import {
  dinero, etiquetaEstado, marcoPorId, medidas, mensajeObra, obraPorId,
  precioMarco, precioPaspartu, totalItem, urlObra,
} from "@/lib/tienda";
import Marco from "./Marco";
import Sheet from "./Sheet";
import { useTienda } from "./Tienda";

export default function FichaObra({ obraId, open, onClose }: { obraId: string | null; open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} labelledBy="ficha-titulo">
      {/* key: reinicia la elección de marco al cambiar de obra */}
      {obraId && <Contenido key={obraId} obraId={obraId} onClose={onClose} />}
    </Sheet>
  );
}

function Contenido({ obraId, onClose }: { obraId: string; onClose: () => void }) {
  const { seleccion, guardarItem, toast } = useTienda();
  const obra = obraPorId.get(obraId)!;
  const enSeleccion = seleccion.find((s) => s.id === obraId);
  const [marco, setMarco] = useState<MarcoId>(enSeleccion?.marco ?? "negro");
  const [paspartu, setPaspartu] = useState(enSeleccion?.paspartu ?? true);

  const vendida = obra.estado === "vendida";
  const disponible = obra.estado === "disponible";
  const item = { id: obra.id, marco, paspartu };
  const pMarco = precioMarco(obra, marco);
  const pPasp = marco !== "ninguno" && paspartu ? precioPaspartu(obra) : 0;
  const m = marcoPorId.get(marco)!;
  const tecnica = tecnicas.find((t) => t.id === obra.tecnica)?.nombre ?? obra.tecnica;

  const flechas = (e: KeyboardEvent) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const i = marcos.findIndex((x) => x.id === marco);
    const sig = marcos[(i + d + marcos.length) % marcos.length];
    setMarco(sig.id);
    (e.currentTarget.querySelector(`[data-id="${sig.id}"]`) as HTMLElement | null)?.focus();
  };

  const agregar = () => {
    const r = guardarItem(item);
    toast(r === "agregada" ? `“${obra.titulo}” agregada a tu selección` : "Selección actualizada");
    onClose();
  };

  const compartir = async () => {
    const url = urlObra(obra.id);
    try {
      if (navigator.share && matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: `${obra.titulo} · ${site.nombre}`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast("Enlace copiado");
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") toast(url);
    }
  };

  const textoWa = vendida ? "Pedir una obra similar" : obra.estado === "reservada" ? "Avísame si se libera" : "Consultar esta obra";

  return (
    <>
      <div className="sheet__stage">
        <Marco obra={obra} marco={vendida ? "ninguno" : marco} paspartu={!vendida && paspartu} />
      </div>
      <div className="sheet__body">
        <p className="eyebrow">
          {tecnica} · {obra.anio} · {etiquetaEstado[obra.estado]}
        </p>
        <h2 className="sheet__title" id="ficha-titulo">{obra.titulo}</h2>
        <p className="sheet__desc">
          {obra.soporte}, {medidas(obra)}. {obra.descripcion}
        </p>

        {vendida ? (
          <p className="sold-note">Esta pieza ya encontró hogar. Puedo hacer algo en la misma línea para ti.</p>
        ) : (
          <>
            <div className="opt">
              <p className="label" id="marco-label">Marco</p>
              <div className="swatches" role="radiogroup" aria-labelledby="marco-label" onKeyDown={flechas}>
                {marcos.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    role="radio"
                    className="swatch"
                    data-id={x.id}
                    aria-checked={x.id === marco}
                    tabIndex={x.id === marco ? 0 : -1}
                    aria-label={x.nombre}
                    title={x.nombre}
                    onClick={() => setMarco(x.id)}
                  />
                ))}
              </div>
              <p className="opt__detail">
                <b>{m.nombre}</b> — {m.detalle}
                {pMarco ? ` · +${dinero(pMarco)}` : ""}
              </p>
            </div>

            <label className={`toggle${marco === "ninguno" ? " is-disabled" : ""}`}>
              <input
                type="checkbox"
                checked={paspartu && marco !== "ninguno"}
                disabled={marco === "ninguno"}
                onChange={(e) => setPaspartu(e.target.checked)}
              />
              <span className="toggle__ui" aria-hidden="true" />
              <span className="toggle__text">
                Paspartú blanco{" "}
                <small>{marco === "ninguno" ? "(requiere marco)" : `+${dinero(precioPaspartu(obra))}`}</small>
              </span>
            </label>

            <dl className="price">
              <div><dt>Obra</dt><dd>{dinero(obra.precio)}</dd></div>
              {pMarco > 0 && (
                <div><dt>Enmarcado</dt><dd>{dinero(pMarco + pPasp)}</dd></div>
              )}
              <div className="price__total"><dt>Total</dt><dd data-testid="total">{dinero(totalItem(item))}</dd></div>
            </dl>
          </>
        )}

        <div className="sheet__actions">
          {disponible && (
            <button className="btn btn--ink btn--block" type="button" onClick={agregar}>
              {enSeleccion ? "Actualizar en mi selección" : "Agregar a mi selección"}
            </button>
          )}
          <a className="btn btn--wa btn--block" href={waLink(mensajeObra(obra, item))} target="_blank" rel="noopener noreferrer">
            <WhatsappLogo size={20} weight="fill" aria-hidden="true" />
            {textoWa}
          </a>
        </div>
        <button className="linkish" type="button" onClick={compartir}>Copiar enlace de esta obra</button>
      </div>
    </>
  );
}
