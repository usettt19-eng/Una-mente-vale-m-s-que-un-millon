"use client";

import { useState } from "react";
import { CalendarCheck, PiggyBank, Plus, Shield, Split, Trash2 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useAppState } from "@/lib/storage";
import { resilienceMetrics } from "@/lib/insights";
import type { Resilience } from "@/lib/types";
import { formatMoney, todayISO } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button, Field, Input, SectionTitle, Segmented } from "@/components/ui/form";

const COLORS = ["#10B981", "#F59E0B", "#38BDF8", "#A78BFA", "#F472B6", "#94A3B8"];

const REVIEW_CHECKLIST = [
  "¿Mi fondo de emergencia sigue cubriendo los meses objetivo?",
  "¿Ha cambiado algún gasto fijo (alquiler, seguros, suscripciones)?",
  "¿Mis inversiones siguen alineadas con mi plan y mi horizonte?",
  "¿Puedo añadir o reforzar una fuente de ingreso?",
  "¿Tengo deudas caras que priorizar?",
  "¿Mis seguros y beneficiarios están al día?",
];

export function ResilienceTool() {
  const { state, update } = useAppState();
  const r = state.resilience;
  const m = resilienceMetrics(state);
  const [src, setSrc] = useState({ name: "", monthly: "" });
  const [checked, setChecked] = useState<boolean[]>(REVIEW_CHECKLIST.map(() => false));

  const patch = (p: Partial<Resilience>) => update((s) => ({ ...s, resilience: { ...s.resilience, ...p } }));
  const num = (v: string) => Math.max(0, Number(v) || 0);
  const shield = Math.round((m.fundPct + m.diversificationPct + m.reviewPct) / 3);

  const addSource = () => {
    if (!src.name.trim()) return;
    patch({ incomeSources: [...r.incomeSources, { name: src.name.trim(), monthly: num(src.monthly) }] });
    setSrc({ name: "", monthly: "" });
  };

  return (
    <div className="space-y-5">
      <Card className="flex items-center gap-4">
        <Shield size={36} className={shield >= 60 ? "text-emerald" : "text-gold"} />
        <div className="flex-1">
          <p className="text-xs text-slate-400">Fortaleza del escudo</p>
          <div className="flex items-center gap-3"><span className="text-3xl font-semibold text-slate-50">{shield}</span><Progress value={shield} /></div>
        </div>
      </Card>

      <div className="grid items-start gap-5 lg:grid-cols-3">
        <Card>
          <SectionTitle aside={<PiggyBank size={16} className="text-emerald" />}>1 · Fondo de tranquilidad</SectionTitle>
          <div className="space-y-3">
            <Field label="Ahorro disponible para emergencias (€)" htmlFor="ef">
              <Input id="ef" type="number" min={0} value={r.emergencyFund || ""} onChange={(e) => patch({ emergencyFund: num(e.target.value) })} />
            </Field>
            <Field label="Gastos esenciales al mes (€)" htmlFor="me" hint="Vivienda, comida, suministros, transporte, deudas.">
              <Input id="me" type="number" min={0} value={r.monthlyExpenses || ""} onChange={(e) => patch({ monthlyExpenses: num(e.target.value) })} />
            </Field>
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-slate-300">Meses objetivo</p>
              <Segmented label="Meses objetivo" value={r.targetMonths} onChange={(v) => patch({ targetMonths: v })}
                options={[3, 6, 9, 12].map((n) => ({ value: n, label: `${n}` }))} />
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs"><span className="text-slate-400">{m.monthsCovered.toFixed(1)} meses cubiertos</span><span className="text-slate-300">{Math.round(m.fundPct)}%</span></div>
            <Progress value={m.fundPct} tone={m.fundPct >= 60 ? "emerald" : "gold"} />
            {m.fundPct < 100 && r.monthlyExpenses > 0 && (
              <p className="mt-2 text-[11px] text-slate-500">Faltan {formatMoney(Math.max(0, r.targetMonths * r.monthlyExpenses - r.emergencyFund))} para tu objetivo.</p>
            )}
          </div>
        </Card>

        <Card>
          <SectionTitle aside={<Split size={16} className="text-emerald" />}>2 · Fuentes de ingreso</SectionTitle>
          {r.incomeSources.length > 0 && (
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={r.incomeSources} dataKey="monthly" nameKey="name" innerRadius={35} outerRadius={55} stroke="none">
                    {r.incomeSources.map((s, i) => <Cell key={s.name + i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatMoney(v)} contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} itemStyle={{ color: "#E2E8F0" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <ul className="space-y-1.5">
            {r.incomeSources.map((s, i) => (
              <li key={s.name + i} className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="flex-1 text-slate-300">{s.name}</span>
                <span className="tabular-nums text-slate-400">{formatMoney(s.monthly)}</span>
                <button aria-label={`Borrar ${s.name}`} className="text-slate-600 hover:text-rose-300"
                  onClick={() => patch({ incomeSources: r.incomeSources.filter((_, j) => j !== i) })}><Trash2 size={13} /></button>
              </li>
            ))}
          </ul>
          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); addSource(); }}>
            <label htmlFor="sn" className="sr-only">Fuente</label>
            <Input id="sn" value={src.name} onChange={(e) => setSrc({ ...src, name: e.target.value })} placeholder="Fuente" />
            <label htmlFor="sm" className="sr-only">€/mes</label>
            <Input id="sm" type="number" min={0} className="w-24" value={src.monthly} onChange={(e) => setSrc({ ...src, monthly: e.target.value })} placeholder="€/mes" />
            <Button type="submit" aria-label="Añadir fuente" disabled={!src.name.trim()}><Plus size={16} /></Button>
          </form>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs"><span className="text-slate-400">{Math.round(m.dependency * 100)}% depende de la principal</span><span className="text-slate-300">{Math.round(m.diversificationPct)}%</span></div>
            <Progress value={m.diversificationPct} tone={m.diversificationPct >= 60 ? "emerald" : "gold"} />
            <p className="mt-2 text-[11px] text-slate-500">Meta: que ninguna fuente supere el 50% de tus ingresos.</p>
          </div>
        </Card>

        <Card>
          <SectionTitle aside={<CalendarCheck size={16} className="text-emerald" />}>3 · Revisión periódica</SectionTitle>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-300">Revisar cada</p>
            <Segmented label="Frecuencia de revisión" value={r.reviewEveryDays} onChange={(v) => patch({ reviewEveryDays: v })}
              options={[{ value: 30, label: "Mes" }, { value: 90, label: "Trimestre" }, { value: 180, label: "Semestre" }]} />
          </div>
          <p className="mt-3 text-sm text-slate-300">
            {m.daysSinceReview === null ? "Aún no has hecho ninguna revisión."
              : m.reviewDueIn > 0 ? `Próxima revisión en ${m.reviewDueIn} días.` : `Revisión atrasada ${-m.reviewDueIn} días.`}
          </p>
          <ul className="mt-3 space-y-1.5">
            {REVIEW_CHECKLIST.map((c, i) => (
              <li key={c}>
                <label className="flex cursor-pointer gap-2 text-xs text-slate-400">
                  <input type="checkbox" className="mt-0.5 accent-emerald" checked={checked[i]}
                    onChange={(e) => setChecked(checked.map((x, j) => (j === i ? e.target.checked : x)))} />{c}
                </label>
              </li>
            ))}
          </ul>
          <Button className="mt-4 w-full" disabled={!checked.some(Boolean)}
            onClick={() => { patch({ lastReview: todayISO() }); setChecked(checked.map(() => false)); }}>
            Marcar revisión hecha hoy
          </Button>
        </Card>
      </div>
    </div>
  );
}
