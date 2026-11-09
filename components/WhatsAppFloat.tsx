"use client";

import { WhatsappLogo } from "@phosphor-icons/react";
import { waGeneral } from "@/lib/site";

// sticky + alto 0 en lugar de fixed: no salta cuando la barra del navegador
// móvil se colapsa al hacer scroll (mismo arreglo que en xamigua-web).
export default function WhatsAppFloat() {
  return (
    <div className="wa-dock">
      <a className="wa-fab" href={waGeneral} target="_blank" rel="noopener noreferrer" aria-label="Escribir por WhatsApp">
        <WhatsappLogo size={28} weight="fill" />
      </a>
    </div>
  );
}
