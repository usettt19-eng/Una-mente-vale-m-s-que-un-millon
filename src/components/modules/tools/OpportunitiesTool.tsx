"use client";

import { useState } from "react";
import { Check, Timer, Trash2 } from "lucide-react";
import { useAppState, uid } from "@/lib/storage";
import type { Opportunity } from "@/lib/types";
import { todayISO } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, Empty, Field, Range, SectionTitle, Textarea } from "@/components/ui/form";

const SCAN = ["En el trabajo", "En casa", "Transporte", "Compras", "Trámites y papeleo", "Salud", "Tus aficiones", "Lo que te preguntan tus amigos"];

function quadrant(o: Pick<Opportunity, "pain" | "reach">) {
  const hiP = o.pain >= 3, hiR = o.reach >= 3;
  if (hiP && hiR) return { label: "Oportunidad de oro", tone: "good" as const };
  if (hiP) return { label: "Nicho rentable", tone: "warn" as const };
  if (hiR) return { label: "Mejora masiva", tone: "neutral" as const };
  return { label: "Aparcar", tone: "bad" as const };
}

export function OpportunitiesTool() {
  const { state, update } = useAppState();
  const [f, setF] = useState({ complaint: "", need: "", pain: 3, reach: 3 });

  const save = () => {
    if (!f.complaint.trim() || !f.need.trim()) return;
    update((s) => ({ ...s, opportunities: [{ id: uid(), date: todayISO(), complaint: f.complaint.trim(), need: f.need.trim(), pain: f.pain, reach: f.reach }, ...s.opportunities] }));
    setF({ complaint: "", need: "", pain: 3, reach: 3 });
  };

  const validate = (o: Opportunity) => update((s) => ({
    ...s,
    microSteps: [...s.microSteps, { id: uid(), goal: `Validar: ${o.need}`, step: "Preguntar a 3 personas si pagarían por resolverlo",
      createdAt: new Date().toISOString(), done: false }],
  }));

  const sorted = [...state.opportunities].sort((a, b) => b.pain * b.reach - a.pain * a.reach);
  const validating = new Set(state.microSteps.map((m) => m.goal));

  return (
    <div className="grid items-start gap-5 lg:grid-cols-2">
      <div className="space-y-5">
        <Card>
          <SectionTitle>Registra una queja o fricción</SectionTitle>
          <p className="mb-3 text-xs text-slate-400">Cada queja es una necesidad no resuelta. ¿Dónde mirar hoy?</p>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {SCAN.map((s) => <span key={s} className="rounded-full px-2.5 py-1 text-[11px] text-slate-500 ring-1 ring-white/10">{s}</span>)}
          </div>
          <div className="space-y-3">
            <Field label="Queja, fricción o ineficiencia" htmlFor="cp">
              <Textarea id="cp" value={f.complaint} onChange={(e) => setF({ ...f, complaint: e.target.value })}
                placeholder="Siempre pierdo media hora buscando aparcamiento cerca del trabajo." />
            </Field>
            <Field label="¿Qué necesidad no resuelta hay detrás?" htmlFor="nd" hint="Formúlalo como «Personas que… necesitan…».">
              <Textarea id="nd" value={f.need} onChange={(e) => setF({ ...f, need: e.target.value })}
                placeholder="Conductores que trabajan en el centro necesitan reservar plaza con antelación." />
            </Field>
            <Range id="pn" label="¿Cuánto duele el problema?" value={f.pain} onChange={(n) => setF({ ...f, pain: n })} left="Molestia" right="Muy doloroso" />
            <Range id="rc" label="¿Cuántas personas lo sufren?" value={f.reach} onChange={(n) => setF({ ...f, reach: n })} left="Muy pocas" right="Muchísimas" />
            <p className="text-xs text-slate-400">Clasificación: <Badge tone={quadrant(f).tone}>{quadrant(f).label}</Badge></p>
          </div>
          <Button className="mt-4 w-full" disabled={!f.complaint.trim() || !f.need.trim()} onClick={save}>Añadir al mapa</Button>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <SectionTitle>Mapa de oportunidades</SectionTitle>
          <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-xl bg-night-800/70 sm:mx-auto">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 text-[10px] text-slate-600">
              <span className="border-b border-r border-white/5 p-2">Nicho rentable</span>
              <span className="border-b border-white/5 p-2 text-right text-emerald/70">Oportunidad de oro</span>
              <span className="flex items-end border-r border-white/5 p-2">Aparcar</span>
              <span className="flex items-end justify-end p-2">Mejora masiva</span>
            </div>
            {sorted.map((o, i) => (
              <div key={o.id} title={o.need}
                className="absolute grid h-6 w-6 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full bg-gold text-[10px] font-bold text-night-900 shadow"
                style={{ left: `${((o.reach - 0.5) / 5) * 100}%`, bottom: `${((o.pain - 0.5) / 5) * 100}%` }}>
                {i + 1}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-500"><span>↑ Dolor</span><span>Alcance →</span></div>
        </Card>

        <Card>
          <SectionTitle>Necesidades detectadas</SectionTitle>
          {sorted.length === 0 ? <Empty>Las quejas que registres se convertirán aquí en necesidades.</Empty> : (
            <ol className="space-y-3">
              {sorted.map((o, i) => {
                const q = quadrant(o);
                const inProgress = validating.has(`Validar: ${o.need}`);
                return (
                  <li key={o.id} className="rounded-xl bg-night-800/70 p-3">
                    <div className="flex items-start gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/20 text-[11px] font-bold text-gold">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500">«{o.complaint}»</p>
                        <p className="mt-0.5 text-sm text-slate-100">{o.need}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge tone={q.tone}>{q.label}</Badge>
                          <span className="text-[11px] text-slate-500">Dolor {o.pain} · Alcance {o.reach}</span>
                        </div>
                      </div>
                      <button aria-label="Borrar" className="text-slate-600 hover:text-rose-300"
                        onClick={() => update((s) => ({ ...s, opportunities: s.opportunities.filter((x) => x.id !== o.id) }))}><Trash2 size={14} /></button>
                    </div>
                    <div className="mt-2 flex justify-end">
                      {inProgress
                        ? <span className="flex items-center gap-1 text-xs text-emerald"><Check size={14} /> Validando en 48 h</span>
                        : <Button size="sm" variant="subtle" onClick={() => validate(o)}><Timer size={14} /> Validar en 48 h</Button>}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </Card>
      </div>
    </div>
  );
}
