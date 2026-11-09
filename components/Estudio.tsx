import Reveal from "./Reveal";

export default function Estudio() {
  return (
    <section className="section studio" id="estudio" aria-labelledby="estudio-titulo">
      <Reveal dir="left" amount={0.2}>
        {/* TODO: reemplazar por una foto real del estudio o del artista trabajando */}
        <div className="studio__plate" aria-hidden="true"><span>Foto del estudio</span></div>
      </Reveal>
      <Reveal dir="right" amount={0.2}>
        <p className="eyebrow">IV — Estudio</p>
        <h2 id="estudio-titulo" className="section__title">Sobre Abner</h2>
        <p className="studio__quote">“Busco el momento en que un rostro deja de posar y empieza a pensar.”</p>
        <p className="studio__body">
          Retratista de formación clásica. Trabajo desde la observación directa y la fotografía, en capas lentas, sobre
          papeles de algodón y soportes preparados a mano. Cada pieza sale del estudio firmada y con certificado de
          autenticidad.
        </p>
        {/* TODO: confirmar cifras reales */}
        <dl className="facts">
          <div><dt>Obras entregadas</dt><dd>+120</dd></div>
          <div><dt>Técnicas</dt><dd>3</dd></div>
          <div><dt>Certificado</dt><dd>Incluido</dd></div>
        </dl>
      </Reveal>
    </section>
  );
}
