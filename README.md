# abnergomezart — tienda de retratos

Sitio para vender obra original y recibir encargos de retrato **por WhatsApp**,
con galería y **marco a elección** (vista previa del marco real alrededor de la
obra). Diseñado primero para celular.

Mismo stack que `xamigua-web`: **Next.js 16** (export estático), **TypeScript**,
**Tailwind v4**, **Framer Motion**, **Phosphor Icons**, desplegado en
**Cloudflare**. Sin backend y sin comisiones por venta.

## Cómo funciona la venta

1. El visitante abre una obra → elige marco (sin marco, negro, roble, dorado) y paspartú.
   El precio del marco se calcula solo según el tamaño de la obra.
2. La agrega a **Mi selección** (se guarda en su navegador) y puede sumar varias.
3. **Enviar pedido por WhatsApp** abre el chat con un mensaje ya escrito:
   obras, marcos, total estimado y ciudad de entrega.
4. Tú confirmas disponibilidad y envío, y mandas los datos de pago (transferencia
   o liga de pago de Mercado Pago / Clip / Stripe).

También hay un formulario de **retrato por encargo** (técnica, tamaño, personas,
fecha, idea) que arma el mensaje de WhatsApp, y cada obra tiene un enlace para
compartir (`abnergomezart.com/#obra/la-espera`), útil para Instagram.

## Qué editar

| Qué | Archivo |
|---|---|
| WhatsApp, Instagram, correo, moneda, Google Analytics | `lib/site.ts` |
| Obras (título, técnica, medidas, precio, estado, foto) | `lib/obras.ts` |
| Marcos y precio por cm, paspartú, precio mínimo | `lib/obras.ts` |
| Fotos de las obras | `public/obras/` |
| Textos de estudio y preguntas frecuentes | `components/Estudio.tsx`, `components/Preguntas.tsx` |
| Colores y tipografía | `app/globals.css` (variables en `:root`) |

Estados de una obra: `disponible` (se puede comprar), `reservada` (ofrece
"avísame si se libera"), `vendida` (ofrece "pedir algo similar").

**Fotos:** JPG o WebP de ~1600 px en el lado largo, recortadas a la obra (sin
pared ni marco), con luz pareja. Las `.svg` actuales son provisionales.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build      # genera ./out (estático)
npm run test:e2e   # pruebas con Playwright sobre ./out (celular y escritorio)
```

## Publicar (Cloudflare)

`wrangler.jsonc` ya compila con `NEXT_PUBLIC_SITE_URL=https://abnergomezart.com`.

- **Desde GitHub:** Cloudflare → Workers & Pages → Create → conectar este repo.
  Build: `npm run build`, salida: `out`. Cada push publica.
- **Desde la terminal:** `npx wrangler login` y luego `npx wrangler deploy`.

Después agrega el dominio `abnergomezart.com` en *Custom domains*.

## Antes de publicar

- [ ] Número real de WhatsApp en `lib/site.ts` (hoy es `520000000000`).
- [ ] Obras, precios y fotos reales en `lib/obras.ts` y `public/obras/`.
- [ ] Foto del estudio y cifras reales en `components/Estudio.tsx`.
- [ ] Revisar textos de pagos y envíos en `components/Preguntas.tsx`.
- [ ] (Opcional) ID de Google Analytics en `lib/site.ts` → mide cada clic a WhatsApp.

## Siguiente paso, si crece

Cuando haya volumen, se puede agregar pago en línea (liga de Mercado Pago o
Stripe Checkout por obra) sin cambiar el diseño: el botón de compra pasa a
abrir la liga de pago en lugar de WhatsApp.
