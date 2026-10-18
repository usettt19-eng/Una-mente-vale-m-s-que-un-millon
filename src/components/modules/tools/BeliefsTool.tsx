"use client";

import { useMemo, useState } from "react";
import { ArrowDown, Trash2 } from "lucide-react";
import { useAppState, uid } from "@/lib/storage";
import { BRIDGE_CHECK, detect, suggestBridges } from "@/lib/content/beliefs";
import { todayISO } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, Empty, Field, SectionTitle, Textarea } from "@/components/ui/form";

export function BeliefsTool() {
  const { state, update } = useAppState();
  const [thought, setThought] = useState("");
  const [bridge, setBridge] = useState("");

  const found = useMemo(() => detect(thought), [thought]);
  const suggestions = useMemo(() => suggestBridges(thought), [thought]);

  const save = () => {
    if (!thought.trim() || !bridge.trim()) return;
    update((s) => ({ ...s, beliefs: [{ id: uid(), date: todayISO(), thought: thought.trim(), bridge: bridge.trim() }, ...s.beliefs] }));
    setThought("");
    setBridge("");
  };

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1.1fr_1fr]">
      <Card>
        <SectionTitle>1 · Atrapa el pensamiento automático</SectionTitle>
        <Field label="¿Qué te dijo tu mente sobre el dinero hoy?" htmlFor="thought"
          hint="Escríbelo tal cual, sin suavizarlo.">
          <Textarea id="thought" value={thought} onChange={(e) => setThought(e.target.value)}
            placeholder="Ej.: Nunca voy a poder ahorrar con lo que gano." />
        </Field>

        {thought.trim() && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {found.length ? found.map((d) => (
              <Badge key={d.label} tone="warn" className="whitespace-normal">{d.label} · {d.tip}</Badge>
            )) : <Badge tone="neutral">Sin distorsiones evidentes. ¿Es un hecho o una interpretación?</Badge>}
          </div>
        )}

        <div className="my-5 flex justify-center text-slate-600"><ArrowDown size={18} /></div>

        <SectionTitle>2 · Construye la Creencia Puente</SectionTitle>
        {suggestions.length > 0 && (
          <div className="mb-3 space-y-2">
            <p className="text-[11px] text-slate-500">Propuestas (toca para usar y luego ajústala con tus palabras):</p>
            {suggestions.map((s) => (
              <button key={s} onClick={() => setBridge(s)}
                className="block w-full rounded-lg bg-night-800/70 px-3 py-2 text-left text-sm text-slate-300 ring-1 ring-white/5 hover:ring-emerald/40">
                {s}
              </button>
            ))}
          </div>
        )}
        <Field label="Tu Creencia Puente" htmlFor="bridge">
          <Textarea id="bridge" value={bridge} onChange={(e) => setBridge(e.target.value)}
            placeholder="Estoy aprendiendo a ahorrar un poco cada mes, empezando por 20 €." />
        </Field>
        <ul className="mt-3 space-y-1 text-[11px] text-slate-500">
          {BRIDGE_CHECK.map((c) => <li key={c}>✓ {c}</li>)}
        </ul>
        <Button className="mt-4 w-full" disabled={!thought.trim() || !bridge.trim()} onClick={save}>
          Guardar en el diario
        </Button>
      </Card>

      <Card>
        <SectionTitle aside={<span className="text-xs text-slate-500">{state.beliefs.length} entradas</span>}>
          Diario de creencias
        </SectionTitle>
        {state.beliefs.length === 0 ? <Empty>Tu primera creencia reestructurada aparecerá aquí.</Empty> : (
          <ul className="space-y-3">
            {state.beliefs.map((b) => (
              <li key={b.id} className="group rounded-xl bg-night-800/70 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-slate-500 line-through decoration-slate-600">{b.thought}</p>
                  <button aria-label="Borrar entrada" className="text-slate-600 hover:text-rose-300"
                    onClick={() => update((s) => ({ ...s, beliefs: s.beliefs.filter((x) => x.id !== b.id) }))}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="mt-1 text-sm text-slate-100">{b.bridge}</p>
                <p className="mt-1 text-[10px] text-slate-600">{new Date(b.date + "T12:00:00").toLocaleDateString("es-ES")}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
