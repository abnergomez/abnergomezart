const faq = [
  ["¿Cómo funciona la compra?", "Agrega obras a tu selección, elige marco y envía el pedido por WhatsApp. Te confirmo disponibilidad, costo de envío y te comparto los datos de pago. La obra se aparta al recibir el pago."],
  ["¿Qué métodos de pago aceptas?", "Transferencia bancaria, tarjeta mediante liga de pago y depósito en tienda. Para encargos se pide un anticipo del 50 %."],
  ["¿Hacen envíos?", "Sí, a todo México e internacionales, con guía rastreable y seguro. Las obras enmarcadas viajan en caja con esquineros y doble cartón."],
  ["¿Cuánto tarda un retrato por encargo?", "Entre 2 y 5 semanas según técnica y tamaño. Si tienes una fecha especial, dímelo desde el primer mensaje."],
  ["¿Puedo ver la obra antes de comprarla?", "Claro. Pídeme por WhatsApp un video de la pieza con luz natural, o agenda una visita al estudio."],
] as const;

export default function Preguntas() {
  return (
    <section className="section faq" id="preguntas" aria-labelledby="faq-titulo">
      <header className="section__head">
        <p className="eyebrow">V — Preguntas</p>
        <h2 id="faq-titulo" className="section__title">Antes de comprar</h2>
      </header>
      <div className="faq__list">
        {faq.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
