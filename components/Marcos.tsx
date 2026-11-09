import { marcos } from "@/lib/obras";
import { dinero, precioMarco } from "@/lib/tienda";
import Reveal from "./Reveal";

// El "desde" se calcula con el formato más chico típico (21 × 29,7 cm)
const chico = { ancho: 21, alto: 29.7 };

export default function Marcos() {
  return (
    <section className="section frames-band" aria-labelledby="marcos-titulo">
      <header className="section__head">
        <p className="eyebrow">II — Enmarcado</p>
        <h2 id="marcos-titulo" className="section__title">Lista para colgar</h2>
        <p className="section__note">
          Cada obra puede enviarse enmarcada en madera sólida, con vidrio antirreflejo y paspartú de algodón libre de ácido.
        </p>
      </header>
      <ul className="frames-list">
        {marcos.map((m, i) => (
          <li key={m.id}>
            <Reveal delay={i * 0.08} amount={0.2}>
              <div className={`framed${m.id !== "ninguno" ? " has-mat" : ""}`} data-frame={m.id} aria-hidden="true">
                <div className="framed__mat"><div /></div>
              </div>
              <h3>{m.nombre}</h3>
              <p>{m.detalle}</p>
              <p>{m.porCm ? `Desde ${dinero(precioMarco(chico, m.id))}` : "Sin costo"}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
