import { site, waGeneral } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__sig">{site.nombre}</p>
      <ul className="footer__links">
        <li><a href={site.instagramLink} target="_blank" rel="noopener noreferrer">Instagram</a></li>
        <li><a href={waGeneral} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
        <li><a href={`mailto:${site.email}`}>Correo</a></li>
      </ul>
      <p className="footer__small">
        © {new Date().getFullYear()} {site.marca} · Todas las obras son originales y únicas.
      </p>
    </footer>
  );
}
