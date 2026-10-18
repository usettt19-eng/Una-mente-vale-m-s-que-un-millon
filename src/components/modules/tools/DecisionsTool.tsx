"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Trash2 } from "lucide-react";
import { useAppState, uid } from "@/lib/storage";
import { STEPS, verdict } from "@/lib/content/decisions";
import type { Decision } from "@/lib/types";
import { daysBetween, formatMoney, todayISO } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, Empty, Field, Input, Range, SectionTitle, Segmented, Textarea } from "@/components/ui/form";

type Draft = {
  title: string; stake: string; reversible: boolean; worstCase: string; mitigation: string;
  alignment: number; futureSelf: string; certainty: number; opportunityCost: string;
  indecisionCostPerWeek: string; deadline: string;
};

const EMPTY: Draft = {
  title: "", stake: "", reversible: true, worstCase: "", mitigation: "", alignment: 3, futureSelf: "",
  certainty: 50, opportunityCost: "", indecisionCostPerWeek: "", deadline: "",
};

export function DecisionsTool() {
  const { state, update } = useAppState();
  const [step, setStep] = useState(0); // 0 = título, 1–4 preguntas, 5 = números y veredicto
  const [d, setD] = useState<Draft>(EMPTY);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD({ ...d, [k]: v });
  const bw = state.bandwidth.find((b) => b.date === todayISO())?.score;

  const canNext = [d.title.trim(), d.stake.trim(), true, d.worstCase.trim(), true, true][step];
  const v = verdict(d, bw);

  const save = () => {
    const dec: Decision = {
      id: uid(), createdAt: todayISO(), title: d.title.trim(), stake: d.stake.trim(), reversible: d.reversible,
      worstCase: d.worstCase.trim(), mitigation: d.mitigation.trim(), alignment: d.alignment, certainty: d.certainty,
      futureSelf: d.futureSelf.trim() || undefined, deadline: d.deadline || undefined,
      opportunityCost: d.opportunityCost ? Number(d.opportunityCost) : undefined,
      indecisionCostPerWeek: d.indecisionCostPerWeek ? Number(d.indecisionCostPerWeek) : undefined,
      status: "abierta",
    };
    update((s) => ({ ...s, decisions: [dec, ...s.decisions] }));
    setD(EMPTY);
    setStep(0);
  };

  const open = state.decisions.filter((x) => x.status === "abierta");
  const closed = state.decisions.filter((x) => x.status === "decidida");

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1.1fr_1fr]">
      <Card>
        <div className="mb-5 flex gap-1.5" aria-hidden>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-emerald" : "bg-night-600/60"}`} />
          ))}
        </div>

        {step === 0 && (
          <Field label="¿Qué decisión tienes delante?" htmlFor="dt" hint="Compra grande, inversión, cambio de trabajo…">
            <Input id="dt" value={d.title} onChange={(e) => set("title", e.target.value)} placeholder="¿Cambiar de trabajo a una startup?" />
          </Field>
        )}
        {step > 0 && step < 5 && <p className="mb-1 text-xs text-slate-500">Pregunta {step} de 4</p>}
        {step === 1 && (
          <Field label={STEPS[0].title} htmlFor="st" hint="Más allá del dinero: tiempo, tranquilidad, relaciones, identidad.">
            <Textarea id="st" value={d.stake} onChange={(e) => set("stake", e.target.value)} placeholder="Estabilidad vs. crecimiento profesional" />
          </Field>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-200">{STEPS[1].title}</p>
            <Segmented label="Reversibilidad" value={d.reversible ? "r" : "i"} onChange={(x) => set("reversible", x === "r")}
              options={[{ value: "r", label: "Reversible (puerta de dos sentidos)" }, { value: "i", label: "Irreversible (puerta de un sentido)" }]} />
            <p className="text-xs text-slate-400">
              {d.reversible
                ? "Las decisiones reversibles se toman rápido: el error se corrige barato."
                : "Las irreversibles merecen calma, más información y un buen plan B."}
            </p>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <Field label="Peor escenario realista (no catastrófico)" htmlFor="wc">
              <Textarea id="wc" value={d.worstCase} onChange={(e) => set("worstCase", e.target.value)} placeholder="La empresa cierra en 12 meses" />
            </Field>
            <Field label="Plan de mitigación: si pasa, ¿qué harías?" htmlFor="mi">
              <Textarea id="mi" value={d.mitigation} onChange={(e) => set("mitigation", e.target.value)} placeholder="Tener 6 meses de gastos ahorrados antes de saltar" />
            </Field>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <Range id="al" label={STEPS[3].title} value={d.alignment} onChange={(n) => set("alignment", n)} left="Me aleja" right="Me acerca mucho" />
            <Field label="¿Qué te diría tu yo de dentro de 5 años?" htmlFor="fs">
              <Textarea id="fs" value={d.futureSelf} onChange={(e) => set("futureSelf", e.target.value)} />
            </Field>
            {state.identity.statement && (
              <p className="text-xs text-slate-400">Tu identidad elegida: <span className="italic text-gold-soft">{state.identity.statement}</span></p>
            )}
          </div>
        )}
        {step === 5 && (
          <div className="space-y-4">
            <Range id="ce" label="¿Cuánta certeza tienes?" value={d.certainty} onChange={(n) => set("certainty", n)}
              min={0} max={100} step={5} display={`${d.certainty}%`} left="Ninguna" right="Total" />
            {d.certainty >= 70 && (
              <p className="rounded-lg bg-emerald/10 px-3 py-2 text-xs text-emerald ring-1 ring-emerald/20">
                Has superado el umbral del 70%. Más análisis probablemente sea parálisis.
              </p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Costo de oportunidad (€)" htmlFor="oc" hint="Lo que dejas de ganar con la mejor alternativa.">
                <Input id="oc" type="number" min={0} value={d.opportunityCost} onChange={(e) => set("opportunityCost", e.target.value)} />
              </Field>
              <Field label="Costo de no decidir (€/semana)" htmlFor="ic" hint="Lo que pierdes cada semana que esperas.">
                <Input id="ic" type="number" min={0} value={d.indecisionCostPerWeek} onChange={(e) => set("indecisionCostPerWeek", e.target.value)} />
              </Field>
            </div>
            <Field label="Fecha límite para decidir" htmlFor="dl">
              <Input id="dl" type="date" value={d.deadline} min={todayISO()} onChange={(e) => set("deadline", e.target.value)} />
            </Field>
            <VerdictBox v={v} />
            {bw === undefined && <p className="text-[11px] text-slate-500">Consejo: mide tu ancho de banda de hoy para un veredicto más fiable.</p>}
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={16} /> Atrás</Button>
          {step < 5
            ? <Button disabled={!canNext} onClick={() => setStep(step + 1)}>Siguiente <ArrowRight size={16} /></Button>
            : <Button onClick={save}><Check size={16} /> Guardar decisión</Button>}
        </div>
      </Card>

      <div className="space-y-5">
        <Card>
          <SectionTitle aside={<span className="text-xs text-slate-500">{open.length}</span>}>Decisiones abiertas</SectionTitle>
          {open.length === 0 ? <Empty>No tienes decisiones pendientes.</Empty> : (
            <ul className="space-y-4">{open.map((x) => <OpenDecision key={x.id} d={x} bw={bw} />)}</ul>
          )}
        </Card>
        {closed.length > 0 && (
          <Card>
            <SectionTitle>Decididas</SectionTitle>
            <ul className="space-y-2">
              {closed.map((x) => (
                <li key={x.id} className="rounded-xl bg-night-800/70 p-3 text-sm">
                  <p className="text-slate-200">{x.title}</p>
                  {x.choice && <p className="text-xs text-emerald">→ {x.choice}</p>}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}

function VerdictBox({ v }: { v: ReturnType<typeof verdict> }) {
  const style = { good: "bg-emerald/10 ring-emerald/20 text-emerald", warn: "bg-gold/10 ring-gold/20 text-gold", bad: "bg-rose-400/10 ring-rose-400/20 text-rose-300" }[v.tone];
  return (
    <div className={`rounded-xl p-3 ring-1 ${style}`}>
      <p className="text-sm font-semibold">{v.title}</p>
      <p className="mt-0.5 text-xs text-slate-300">{v.text}</p>
    </div>
  );
}

function OpenDecision({ d, bw }: { d: Decision; bw?: number }) {
  const { update } = useAppState();
  const [choice, setChoice] = useState("");
  const weeks = Math.max(0, Math.floor(daysBetween(d.createdAt, todayISO()) / 7));
  const lost = (d.indecisionCostPerWeek ?? 0) * weeks;
  const patch = (p: Partial<Decision>) => update((s) => ({ ...s, decisions: s.decisions.map((x) => (x.id === d.id ? { ...x, ...p } : x)) }));

  return (
    <li className="rounded-xl bg-night-800/70 p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-100">{d.title}</p>
        <div className="flex items-center gap-2">
          <Badge tone={d.reversible ? "good" : "warn"}>{d.reversible ? "Reversible" : "Irreversible"}</Badge>
          <button aria-label="Borrar decisión" className="text-slate-600 hover:text-rose-300"
            onClick={() => update((s) => ({ ...s, decisions: s.decisions.filter((x) => x.id !== d.id) }))}><Trash2 size={14} /></button>
        </div>
      </div>
      <dl className="mb-3 space-y-1 text-xs">
        <div><dt className="inline text-slate-500">En juego: </dt><dd className="inline text-slate-300">{d.stake}</dd></div>
        <div><dt className="inline text-slate-500">Peor caso: </dt><dd className="inline text-slate-300">{d.worstCase}</dd></div>
        {d.mitigation && <div><dt className="inline text-slate-500">Plan B: </dt><dd className="inline text-slate-300">{d.mitigation}</dd></div>}
      </dl>
      <Range id={`c-${d.id}`} label="Certeza actual" value={d.certainty} onChange={(n) => patch({ certainty: n })}
        min={0} max={100} step={5} display={`${d.certainty}%`} />
      <div className="mt-2 flex flex-wrap gap-x-4 text-[11px] text-slate-400">
        {d.opportunityCost ? <span>Costo de oportunidad: {formatMoney(d.opportunityCost)}</span> : null}
        {d.indecisionCostPerWeek ? <span>Indecisión: {formatMoney(d.indecisionCostPerWeek)}/sem · ya ~{formatMoney(lost)}</span> : null}
        {d.deadline && <span>Límite: {new Date(d.deadline + "T12:00:00").toLocaleDateString("es-ES")}</span>}
      </div>
      <div className="mt-3"><VerdictBox v={verdict(d, bw)} /></div>
      <form className="mt-3 flex gap-2" onSubmit={(e) => {
        e.preventDefault();
        patch({ status: "decidida", choice: choice.trim() || undefined, decidedAt: todayISO() });
      }}>
        <label htmlFor={`ch-${d.id}`} className="sr-only">Qué decidiste</label>
        <Input id={`ch-${d.id}`} value={choice} onChange={(e) => setChoice(e.target.value)} placeholder="¿Qué decidiste?" />
        <Button type="submit" variant="subtle">Decidida</Button>
      </form>
    </li>
  );
}
