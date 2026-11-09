import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const dynamic = "force-static";
export const alt = `${site.nombre} · ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "0 96px",
          background: "linear-gradient(135deg, #f3efe7 0%, #e1d9cb 100%)", color: "#171513",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 8, textTransform: "uppercase", color: "#72695e" }}>{site.tagline}</div>
        <div style={{ fontSize: 120, fontStyle: "italic", marginTop: 16, fontFamily: "serif" }}>{site.nombre}</div>
        <div style={{ fontSize: 32, marginTop: 24, color: "#6e2a1f" }}>Obra disponible · Retratos por encargo</div>
      </div>
    ),
    size,
  );
}
