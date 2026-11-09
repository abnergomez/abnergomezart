"use client";

import { WhatsappLogo } from "@phosphor-icons/react";
import { useState } from "react";
import { waLink } from "@/lib/site";
import { dinero, marcoPorId, medidas, mensajePedido, obraPorId, totalItem } from "@/lib/tienda";
import Sheet from "./Sheet";
import { useTienda } from "./Tienda";

export default function Seleccion({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { seleccion, quitarItem, toast } = useTienda();
  const [ciudad, setCiudad] = useState("");
  const total = seleccion.reduce((s, i) => s + totalItem(i), 0);

  const irAGaleria = () => {
    onClose();
    setTimeout(() => document.getElementById("galeria")?.scrollIntoView({ behavior: "smooth" }), 320);
  };

  return (
    <Sheet open={open} onClose={onClose} labelledBy="sel-titulo" className="sheet--bag">
      <div className="sheet__body">
        <p className="eyebrow">Tu pedido</p>
        <h2 className="sheet__title" id="sel-titulo">Mi selección</h2>

        {seleccion.length === 0 ? (
          <div className="bag__empty">
            <p>Aún no has elegido ninguna obra.</p>
            <button className="btn btn--line" type="button" onClick={irAGaleria}>Explorar la galería</button>
          </div>
        ) : (
          <>
            <ul className="bag">
              {seleccion.map((it) => {
                const o = obraPorId.get(it.id)!;
                const m = marcoPorId.get(it.marco)!;
                return (
                  <li key={it.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={o.imagen} alt="" width={64} height={80} />
                    <div>
                      <h3>{o.titulo}</h3>
                      <p>
                        {medidas(o)}
                        <br />
                        {it.marco === "ninguno" ? "Sin marco" : `${m.nombre}${it.paspartu ? " · paspartú" : ""}`}
                      </p>
                    </div>
                    <div>
                      <div className="bag__price">{dinero(totalItem(it))}</div>
                      <button
                        type="button"
                        className="bag__rm"
                        aria-label={`Quitar ${o.titulo}`}
                        onClick={() => {
                          quitarItem(it.id);
                          toast(`“${o.titulo}” quitada`);
                        }}
                      >
                        Quitar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <dl className="price">
              <div className="price__total"><dt>Total estimado</dt><dd data-testid="bag-total">{dinero(total)}</dd></div>
            </dl>
            <p className="bag__note">El envío se cotiza según tu ciudad. No se cobra nada hasta confirmar por WhatsApp.</p>
            <label className="field" style={{ marginBottom: 18 }}>
              <span className="label">Ciudad de entrega <small>(opcional)</small></span>
              <input
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                autoComplete="address-level2"
                placeholder="Ej. Puebla, Pue."
                maxLength={80}
              />
            </label>
            <a
              className="btn btn--wa btn--block"
              href={waLink(mensajePedido(seleccion, ciudad))}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="enviar-pedido"
            >
              <WhatsappLogo size={20} weight="fill" aria-hidden="true" />
              Enviar pedido por WhatsApp
            </a>
          </>
        )}
      </div>
    </Sheet>
  );
}
