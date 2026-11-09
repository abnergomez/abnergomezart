"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { limpiarSeleccion, obraPorId, type Item } from "@/lib/tienda";
import FichaObra from "./FichaObra";
import Seleccion from "./Seleccion";

type Ctx = {
  seleccion: Item[];
  guardarItem: (item: Item) => "agregada" | "actualizada";
  quitarItem: (id: string) => void;
  abrirObra: (id: string) => void;
  abrirSeleccion: () => void;
  toast: (msg: string) => void;
  /** se incrementa cada vez que se agrega algo — para animar el ícono */
  pulso: number;
};

const TiendaCtx = createContext<Ctx | null>(null);
export const useTienda = () => {
  const c = useContext(TiendaCtx);
  if (!c) throw new Error("useTienda debe usarse dentro de <Tienda>");
  return c;
};

const CLAVE = "ag_seleccion_v1";
const leer = (): Item[] => {
  try {
    return limpiarSeleccion(JSON.parse(localStorage.getItem(CLAVE) || "[]"));
  } catch {
    return []; // modo privado o JSON corrupto
  }
};
const escribir = (items: Item[]) => {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(items));
  } catch {
    /* almacenamiento bloqueado: la selección vive solo en esta visita */
  }
};

const HASH = /^#obra\/([\w-]+)$/;

export default function Tienda({ children }: { children: ReactNode }) {
  const [seleccion, setSeleccion] = useState<Item[]>([]);
  const [cargada, setCargada] = useState(false);
  const [obraId, setObraId] = useState<string | null>(null);
  const [fichaAbierta, setFichaAbierta] = useState(false);
  const [selAbierta, setSelAbierta] = useState(false);
  const [pulso, setPulso] = useState(0);
  const [msg, setMsg] = useState<{ t: string; n: number } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const toastRef = useRef<HTMLDivElement>(null);

  // localStorage solo existe en el navegador: se carga después de hidratar.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza con almacenamiento externo tras hidratar
    setSeleccion(leer());
    setCargada(true);
  }, []);
  useEffect(() => {
    if (cargada) escribir(seleccion);
  }, [seleccion, cargada]);

  const toast = useCallback((t: string) => {
    setMsg({ t, n: Date.now() });
    // popover = capa superior: el aviso se ve incluso sobre un <dialog> modal abierto
    const el = toastRef.current;
    if (el?.showPopover) {
      try {
        if (el.matches(":popover-open")) el.hidePopover();
        el.showPopover();
      } catch {
        /* sin soporte: queda como elemento fixed normal */
      }
    }
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setMsg(null), 2400);
  }, []);

  const abrirObra = useCallback(
    (id: string) => {
      if (!obraPorId.has(id)) {
        toast("Esa obra ya no está en la galería.");
        return;
      }
      setSelAbierta(false); // nunca dos paneles encimados
      setObraId(id);
      setFichaAbierta(true);
      if (location.hash !== `#obra/${id}`) history.replaceState(null, "", `#obra/${id}`);
    },
    [toast],
  );

  const cerrarFicha = useCallback(() => {
    setFichaAbierta(false);
    if (HASH.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
  }, []);

  // Enlaces compartibles: abnergomezart.com/#obra/<id>
  useEffect(() => {
    const ruta = () => {
      const m = location.hash.match(HASH);
      if (m) abrirObra(m[1]);
    };
    ruta();
    window.addEventListener("hashchange", ruta);
    return () => window.removeEventListener("hashchange", ruta);
  }, [abrirObra]);

  const guardarItem = useCallback((item: Item) => {
    let r: "agregada" | "actualizada" = "agregada";
    setSeleccion((s) => {
      const i = s.findIndex((x) => x.id === item.id);
      if (i === -1) return [...s, item];
      r = "actualizada";
      return s.map((x, j) => (j === i ? item : x));
    });
    setPulso((p) => p + 1);
    return r;
  }, []);

  const quitarItem = useCallback((id: string) => setSeleccion((s) => s.filter((x) => x.id !== id)), []);

  const value = useMemo<Ctx>(
    () => ({
      seleccion,
      guardarItem,
      quitarItem,
      abrirObra,
      abrirSeleccion: () => setSelAbierta(true),
      toast,
      pulso,
    }),
    [seleccion, guardarItem, quitarItem, abrirObra, toast, pulso],
  );

  return (
    <TiendaCtx.Provider value={value}>
      {children}
      <FichaObra obraId={obraId} open={fichaAbierta} onClose={cerrarFicha} />
      <Seleccion open={selAbierta} onClose={() => setSelAbierta(false)} />
      <div ref={toastRef} popover="manual" className={`toast${msg ? " is-on" : ""}`} role="status" aria-live="polite">
        {msg?.t}
      </div>
    </TiendaCtx.Provider>
  );
}
