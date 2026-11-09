import Link from "next/link";

export default function NotFound() {
  return (
    <main className="section" style={{ minHeight: "80svh", display: "grid", placeContent: "center", textAlign: "center" }}>
      <p className="eyebrow">Error 404</p>
      <h1 className="section__title">Esta página <em>no existe</em></h1>
      <p style={{ marginTop: 24 }}>
        <Link className="btn btn--ink" href="/">Volver a la galería</Link>
      </p>
    </main>
  );
}
