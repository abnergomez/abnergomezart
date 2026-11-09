import type { CSSProperties } from "react";
import type { MarcoId, Obra } from "@/lib/obras";

/** Obra con moldura y paspartú dibujados en CSS (ver .framed en globals.css). */
export default function Marco({
  obra,
  marco,
  paspartu,
  lazy = false,
  className = "",
  style,
}: {
  obra: Obra;
  marco: MarcoId;
  paspartu: boolean;
  lazy?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const conPaspartu = paspartu && marco !== "ninguno";
  return (
    <div
      className={`framed${conPaspartu ? " has-mat" : ""} ${className}`}
      data-frame={marco}
      style={{ ["--ratio" as string]: (obra.ancho / obra.alto).toFixed(4), ...style }}
    >
      <div className="framed__mat">
        {/* eslint-disable-next-line @next/next/no-img-element -- export estático, sin optimizador de imágenes */}
        <img
          src={obra.imagen}
          alt={`${obra.titulo}, ${obra.soporte}`}
          width={1000}
          height={Math.round((1000 * obra.alto) / obra.ancho)}
          loading={lazy ? "lazy" : "eager"}
          decoding="async"
        />
      </div>
    </div>
  );
}
