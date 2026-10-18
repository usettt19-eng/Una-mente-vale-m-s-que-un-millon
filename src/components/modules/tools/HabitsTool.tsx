"use client";

import { useState } from "react";
import { AlertTriangle, Flame, Trash2, Zap } from "lucide-react";
import { useAppState, uid } from "@/lib/storage";
import { habitStatus } from "@/lib/insights";
import type { Habit } from "@/lib/types";
import { cn, localISO, todayISO } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button, Empty, Field, Input, SectionTitle, Segmented } from "@/components/ui/form";

const IDEAS: { name: string; automated: boolean; automation?: string; minimal?: string }[] = [
  { name: "Transferencia automática al ahorro", automated: true, automation: "10% del sueldo el día de cobro" },
  { name: "Aportación automática a fondo indexado", automated: true, automation: "Aportación mensual programada" },
  { name: "Pago automático de deudas", automated: true, automation: "Domiciliar el pago mínimo + extra" },
  { name: "Registrar gastos del día", automated: false, minimal: "Anotar solo el gasto más grande" },
  { name: "Revisión semanal de 10 min", automated: false, minimal: "Mirar el saldo 1 minuto" },
];

function lastDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const x = new Date();
    x.setDate(x.getDate() - (n - 1 - i));
    return localISO(x);
  });
}

export function HabitsTool() {
  const { state, update } = useAppState();
  const [f, setF] = useState({ name: "", automated: false, automation: "", minimal: "" });

  const add = (h: typeof f) => {
    if (!h.name.trim()) return;
    update((s) => ({ ...s, habits: [...s.habits, { id: uid(), name: h.name.trim(), automated: h.automated,
      automation: h.automation.trim() || undefined, minimal: h.minimal.trim() || undefined, log: [] }] }));
    setF({ name: "", automated: false, automation: "", minimal: "" });
  };

  const existing = new Set(state.habits.map((h) => h.name));
  const days = lastDays(7);
  const rate = state.habits.length
    ? Math.round((state.habits.reduce((a, h) => a + h.log.filter((d) => days.includes(d)).length, 0) / (state.habits.length * 7)) * 100)
    : 0;
  const automated = state.habits.filter((h) => h.automated).length;

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-5">
        <Card>
          <SectionTitle>Nuevo sistema</SectionTitle>
          <p className="mb-3 text-xs text-slate-400">No subes al nivel de tus metas; caes al nivel de tus sistemas. Lo que se automatiza no depende de tu fuerza de voluntad.</p>
          <div className="space-y-3">
            <Field label="Hábito o rutina" htmlFor="hn">
              <Input id="hn" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Registrar gastos del día" />
            </Field>
            <Segmented label="Tipo" value={f.automated ? "a" : "m"} onChange={(v) => setF({ ...f, automated: v === "a" })}
              options={[{ value: "m", label: "Manual" }, { value: "a", label: "Automatizado" }]} />
            {f.automated ? (
              <Field label="¿Cómo está automatizado?" htmlFor="ha">
                <Input id="ha" value={f.automation} onChange={(e) => setF({ ...f, automation: e.target.value })} placeholder="Orden de transferencia el día 1" />
              </Field>
            ) : (
              <Field label="Versión mínima (2 minutos)" htmlFor="hm" hint="La que harás los días malos para no fallar dos veces.">
                <Input id="hm" value={f.minimal} onChange={(e) => setF({ ...f, minimal: e.target.value })} placeholder="Anotar solo el gasto más grande" />
              </Field>
            )}
          </div>
          <Button className="mt-4 w-full" disabled={!f.name.trim()} onClick={() => add(f)}>Añadir sistema</Button>
        </Card>
        <Card>
          <SectionTitle>Ideas rápidas</SectionTitle>
          <ul className="space-y-2">
            {IDEAS.filter((i) => !existing.has(i.name)).map((i) => (
              <li key={i.name} className="flex items-center gap-2">
                {i.automated ? <Zap size={14} className="shrink-0 text-gold" /> : <span className="w-3.5" />}
                <span className="flex-1 text-sm text-slate-300">{i.name}</span>
                <Button size="sm" variant="subtle" onClick={() => add({ name: i.name, automated: i.automated, automation: i.automation ?? "", minimal: i.minimal ?? "" })}>Añadir</Button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-3">
          <Mini label="Cumplimiento 7 días" value={`${rate}%`} />
          <Mini label="Sistemas" value={String(state.habits.length)} />
          <Mini label="Automatizados" value={String(automated)} />
        </div>
        {state.habits.length === 0 ? <Empty>Crea tu primer sistema. Empieza por uno automatizado.</Empty> :
          state.habits.map((h) => <HabitRow key={h.id} h={h} />)}
      </div>
    </div>
  );
}

function HabitRow({ h }: { h: Habit }) {
  const { update } = useAppState();
  const s = habitStatus(h);
  const days = lastDays(14);
  const toggle = (d: string) => update((st) => ({
    ...st, habits: st.habits.map((x) => x.id !== h.id ? x : { ...x, log: x.log.includes(d) ? x.log.filter((y) => y !== d) : [...x.log, d] }),
  }));

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-medium text-slate-100">
            {h.automated && <Zap size={14} className="text-gold" aria-label="Automatizado" />}{h.name}
          </p>
          {(h.automation || h.minimal) && (
            <p className="text-[11px] text-slate-500">{h.automated ? h.automation : `Mínimo: ${h.minimal}`}</p>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs text-slate-300"><Flame size={14} className={s.streak ? "text-gold" : "text-slate-600"} />{s.streak}</span>
        <button aria-label="Borrar hábito" className="text-slate-600 hover:text-rose-300"
          onClick={() => window.confirm(`¿Borrar «${h.name}»?`) && update((st) => ({ ...st, habits: st.habits.filter((x) => x.id !== h.id) }))}>
          <Trash2 size={14} />
        </button>
      </div>
      {s.neverTwiceAlert && (
        <div className="mt-3 flex gap-2 rounded-lg bg-gold/10 p-2.5 text-xs text-gold-soft ring-1 ring-gold/20">
          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-gold" />
          <span>Ayer fallaste, y está bien. La regla es no fallar dos veces: tienes hasta hoy por la noche.
            {h.minimal && <> Hoy basta con: <strong>{h.minimal}</strong>.</>}</span>
        </div>
      )}
      <div className="mt-3 grid grid-cols-7 gap-1.5 sm:grid-cols-14">
        {days.map((d) => {
          const on = h.log.includes(d);
          const isToday = d === todayISO();
          return (
            <button key={d} onClick={() => toggle(d)} aria-pressed={on}
              aria-label={`${d}: ${on ? "hecho" : "sin hacer"}`}
              className={cn("flex aspect-square flex-col items-center justify-center rounded-md text-[9px] transition",
                on ? "bg-emerald text-night-900" : "bg-night-600/40 text-slate-500 hover:bg-night-600",
                isToday && "ring-2 ring-gold")}>
              {new Date(d + "T12:00:00").getDate()}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-night-700/60 p-3 text-center">
      <p className="text-xl font-semibold text-slate-100">{value}</p>
      <p className="text-[10px] text-slate-500">{label}</p>
    </div>
  );
}
