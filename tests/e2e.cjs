/* eslint-disable @typescript-eslint/no-require-imports -- script de Node en CommonJS */
// Pruebas de extremo a extremo sobre el build estático (./out).
// Uso: npm run build && npm run test:e2e
// Requiere Playwright (preinstalado en el entorno de desarrollo).
const { chromium, devices } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "out");
const SHOTS = process.env.SHOTS || "";
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml" };

function serve() {
  return new Promise((res) => {
    const srv = http.createServer((req, r) => {
      let p = decodeURIComponent(req.url.split("?")[0]);
      if (p.endsWith("/")) p += "index.html";
      let f = path.join(OUT, p);
      if (!fs.existsSync(f) && fs.existsSync(f + ".html")) f += ".html";
      if (!fs.existsSync(f)) { r.writeHead(404, { "content-type": "text/html" }); return r.end(fs.readFileSync(path.join(OUT, "404.html"))); }
      r.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" });
      r.end(fs.readFileSync(f));
    }).listen(0, () => res(srv));
  });
}

let fallos = 0, ok = 0;
async function t(nombre, fn) {
  try { await fn(); ok++; console.log("  ✓", nombre); }
  catch (e) { fallos++; console.log("  ✗", nombre, "\n     ", e.message.split("\n")[0]); }
}
const assert = (c, m) => { if (!c) throw new Error(m); };
const waText = (href) => decodeURIComponent(new URL(href).searchParams.get("text") || "");

(async () => {
  const srv = await serve();
  const BASE = `http://localhost:${srv.address().port}/`;
  const browser = await chromium.launch();

  const perfiles = [
    ["Celular (iPhone 13)", { ...devices["iPhone 13"] }],
    ["Celular chico (320px)", { viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }],
    ["Escritorio (1440px)", { viewport: { width: 1440, height: 900 } }],
  ];

  for (const [nombre, opts] of perfiles) {
    console.log(`\n${nombre}`);
    const ctx = await browser.newContext({ ...opts, locale: "es-MX" });
    const page = await ctx.newPage();
    const errores = [];
    page.on("console", (m) => m.type() === "error" && errores.push(m.text()));
    page.on("pageerror", (e) => errores.push(e.message));
    page.on("requestfailed", (r) => errores.push("falló " + r.url()));
    page.on("response", (r) => r.status() >= 400 && errores.push(`${r.status()} ${r.url()}`));

    await page.goto(BASE, { waitUntil: "networkidle" });

    await t("carga sin errores de consola ni recursos rotos", async () => {
      assert(errores.length === 0, errores.join(" | "));
    });

    await t("sin scroll horizontal", async () => {
      for (const y of [0, 1500, 3000, 99999]) {
        await page.evaluate((y) => scrollTo(0, y), y);
        await page.waitForTimeout(150);
        const { sw, w } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: innerWidth }));
        assert(sw <= w, `scrollWidth ${sw} > ${w} en y=${y}`);
      }
      await page.evaluate(() => scrollTo(0, 0));
    });

    await t("galería con 8 obras y filtro por técnica", async () => {
      assert((await page.locator(".galeria-grid .card").count()) === 8, "no hay 8 obras");
      await page.getByRole("button", { name: /^Óleo/ }).click();
      await page.waitForTimeout(100);
      assert((await page.locator(".galeria-grid .card").count()) === 2, "filtro óleo no da 2");
      await page.getByRole("button", { name: /^Todas/ }).click();
      await page.waitForTimeout(100);
      assert((await page.locator(".galeria-grid .card").count()) === 8, "volver a todas falla");
    });

    await t("ficha: precio con marco y paspartú, y sin marco", async () => {
      await page.locator('.card[aria-label^="Luz de tarde"]').click();
      const dlg = page.locator("dialog[open]");
      await dlg.waitFor();
      await page.waitForTimeout(550);
      // 30x40: perímetro 140 → negro 140*6=840; paspartú 140*1.8=252→250; obra 5800 → 6890
      const total = await dlg.getByTestId("total").textContent();
      assert(total.replace(/\D/g, "") === "6890", "total con marco = " + total);
      await dlg.getByRole("radio", { name: "Sin marco" }).click();
      const t2 = await dlg.getByTestId("total").textContent();
      assert(t2.replace(/\D/g, "") === "5800", "total sin marco = " + t2);
      assert(await dlg.locator(".toggle input").isDisabled(), "paspartú debería deshabilitarse sin marco");
      assert((await dlg.locator(".framed").getAttribute("data-frame")) === "ninguno", "preview no cambió");
    });

    await t("ficha: flechas del teclado cambian el marco", async () => {
      const dlg = page.locator("dialog[open]");
      await dlg.getByRole("radio", { name: "Sin marco" }).focus();
      await page.keyboard.press("ArrowRight");
      assert((await dlg.getByRole("radio", { name: "Negro mate" }).getAttribute("aria-checked")) === "true", "flecha no movió");
      await page.keyboard.press("ArrowRight");
      assert((await dlg.locator(".framed").getAttribute("data-frame")) === "roble", "preview no es roble");
    });

    await t("ficha: enlace de WhatsApp con número y detalle", async () => {
      const href = await page.locator("dialog[open] a.btn--wa").getAttribute("href");
      assert(href.startsWith("https://wa.me/520000000000?text="), href);
      const txt = waText(href);
      assert(txt.includes("Luz de tarde") && txt.includes("roble") && txt.includes("#obra/luz-de-tarde"), txt);
    });

    await t("agregar a la selección y persistir tras recargar", async () => {
      await page.locator("dialog[open]").getByRole("button", { name: "Agregar a mi selección" }).click();
      await page.waitForTimeout(500);
      assert((await page.locator("dialog[open]").count()) === 0, "la ficha no se cerró");
      assert((await page.locator(".bag-btn__count").textContent()) === "1", "contador no es 1");
      assert(!(await page.evaluate(() => document.body.classList.contains("is-locked"))), "scroll quedó bloqueado");
      await page.reload({ waitUntil: "networkidle" });
      assert((await page.locator(".bag-btn__count").textContent()) === "1", "no persistió");
    });

    await t("selección: total, ciudad en el mensaje y quitar", async () => {
      await page.locator(".bag-btn").click();
      const dlg = page.locator("dialog[open]");
      await dlg.waitFor();
      await page.waitForTimeout(550);
      const tot = (await dlg.getByTestId("bag-total").textContent()).replace(/\D/g, "");
      assert(tot === "7030", "total selección = " + tot); // roble: 140*7=980 + paspartú 250 + obra 5800
      await dlg.getByPlaceholder(/Puebla/).fill("Tlaxcala, Tlax.");
      const txt = waText(await dlg.getByTestId("enviar-pedido").getAttribute("href"));
      assert(txt.includes("Entrega en: Tlaxcala, Tlax.") && txt.includes("Luz de tarde"), txt);
      await dlg.getByRole("button", { name: /Quitar Luz de tarde/ }).click();
      assert(await dlg.getByText("Aún no has elegido").isVisible(), "no quedó vacía");
      assert(await page.locator(".toast").isVisible(), "aviso no visible sobre el panel");
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
      assert((await page.locator("dialog[open]").count()) === 0, "Escape no cerró");
      assert((await page.locator(".bag-btn__count").count()) === 0, "contador no desapareció");
    });

    await t("obra vendida: sin botón de compra, pide similar", async () => {
      await page.locator('.card[aria-label^="Abuela Rosa"]').click();
      const dlg = page.locator("dialog[open]");
      await dlg.waitFor();
      assert((await dlg.getByRole("button", { name: /Agregar/ }).count()) === 0, "vendida tiene botón agregar");
      assert(waText(await dlg.locator("a.btn--wa").getAttribute("href")).includes("algo similar"), "mensaje vendida");
      await dlg.getByRole("button", { name: "Cerrar" }).click();
      await page.waitForTimeout(500);
      assert(!/#obra/.test(page.url()), "hash no se limpió: " + page.url());
    });

    await t("enlace directo #obra/la-espera abre la ficha; id inválido no truena", async () => {
      await page.goto(BASE + "#obra/la-espera", { waitUntil: "networkidle" });
      await page.locator("dialog[open]").waitFor();
      assert((await page.locator("#ficha-titulo").textContent()) === "La espera", "no abrió la obra");
      await page.goto(BASE + "#obra/no-existe", { waitUntil: "networkidle" });
      await page.reload({ waitUntil: "networkidle" });
      assert((await page.locator("dialog[open]").count()) === 0, "abrió algo con id inválido");
    });

    await t("localStorage corrupto o con obra vendida no rompe nada", async () => {
      await page.evaluate(() => localStorage.setItem("ag_seleccion_v1", '{"roto":'));
      await page.reload({ waitUntil: "networkidle" });
      assert((await page.locator(".galeria-grid .card").count()) === 8, "página rota con JSON corrupto");
      await page.evaluate(() => localStorage.setItem("ag_seleccion_v1", JSON.stringify([{ id: "abuela-rosa", marco: "negro" }, { id: "x" }, { id: "perfil-i", marco: "dorado", paspartu: true }])));
      await page.reload({ waitUntil: "networkidle" });
      assert((await page.locator(".bag-btn__count").textContent()) === "1", "no filtró entradas inválidas");
      await page.evaluate(() => localStorage.clear());
    });

    await t("encargo: valida nombre y fecha, luego abre WhatsApp", async () => {
      await page.goto(BASE + "#encargos", { waitUntil: "networkidle" });
      await page.evaluate(() => { window.__abierto = null; window.open = (u) => { window.__abierto = u; return {}; }; });
      const form = page.locator(".cform");
      await form.getByRole("button", { name: /Enviar solicitud/ }).click();
      assert((await page.locator("#cform-error").textContent()).includes("nombre"), "sin error de nombre");
      assert(await page.evaluate(() => document.activeElement?.getAttribute("name") === "nombre"), "foco no fue al nombre");
      await form.getByPlaceholder("Nombre").fill("Lucía");
      await form.locator('input[type="date"]').fill("2020-01-01");
      await form.getByRole("button", { name: /Enviar solicitud/ }).click();
      assert((await page.locator("#cform-error").textContent()).includes("fecha"), "aceptó fecha pasada");
      await form.locator('input[type="date"]').fill("2099-05-10");
      await form.locator(".seg label", { hasText: "Óleo" }).click();
      await form.getByRole("button", { name: /Enviar solicitud/ }).click();
      const u = await page.evaluate(() => window.__abierto);
      assert(u && u.startsWith("https://wa.me/"), "no abrió WhatsApp");
      const txt = waText(u);
      assert(txt.includes("soy Lucía") && txt.includes("Óleo") && txt.includes("2099"), txt);
    });

    if (SHOTS) {
      const tag = nombre.split(" ")[0].toLowerCase() + (opts.viewport?.width === 320 ? "320" : "");
      await page.goto(BASE, { waitUntil: "networkidle" });
      await page.waitForTimeout(1300);
      await page.screenshot({ path: `${SHOTS}/${tag}-hero.png` });
      await page.evaluate(() => document.getElementById("galeria").scrollIntoView());
      await page.waitForTimeout(1300);
      await page.screenshot({ path: `${SHOTS}/${tag}-galeria.png` });
      await page.goto(BASE + "#obra/la-espera", { waitUntil: "networkidle" });
      await page.waitForTimeout(900);
      await page.locator("dialog[open]").getByRole("radio", { name: "Dorado antiguo" }).click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${SHOTS}/${tag}-ficha.png` });
      await page.goto(BASE, { waitUntil: "networkidle" });
      await page.evaluate(() => document.getElementById("encargos").scrollIntoView());
      await page.waitForTimeout(1300);
      await page.screenshot({ path: `${SHOTS}/${tag}-encargos.png` });
    }

    await t("sin errores durante todas las interacciones", async () => {
      assert(errores.length === 0, errores.join(" | "));
    });
    await ctx.close();
  }

  await browser.close();
  srv.close();
  console.log(`\n${ok} pruebas OK, ${fallos} fallidas`);
  process.exit(fallos ? 1 : 0);
})();
