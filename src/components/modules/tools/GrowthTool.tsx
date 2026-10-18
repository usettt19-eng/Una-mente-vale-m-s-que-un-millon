"use client";

import { useState } from "react";
import { FlaskConical, Trash2 } from "lucide-react";
import { useAppState, uid } from "@/lib/storage";
import { formatMoney, todayISO } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button, Empty, Field, Input, SectionTitle, Textarea } from "@/components/ui/form";

/** Añade el poder del «aún»: de juicio fijo a habilidad en desarrollo. */
export function addYet(text: string) {
  const t = text.trim().replace(/[.!]+$/, "");
  if (!t) return "";
  const rules: [RegExp, (m: RegExpMatchArray) => string][] = [
    [/^no soy (?:bueno|buena|hábil) (?:con|en|para) (.+)$/i, (m) => `Aún no he desarrollado la habilidad de ${m[1]}.`],
    [/^no sé (.+)$/i, (m) => `Aún no sé ${m[1]}, y puedo aprenderlo.`],
    [/^no puedo (.+)$/i, (m) => `Aún no puedo ${m[1]}; estoy practicando.`],
    [/^soy (?:malo|mala|un desastre|pésimo|pésima) (?:con|en|para) (.+)$/i, (m) => `Todavía estoy aprendiendo ${m[1]}.`],
    [/^no tengo (?:talento|cabeza) para (.+)$/i, (m) => `El talento para ${m[1]} se entrena; aún estoy en ello.`],
    [/^no (.+)$/i, (m) => `Aún no ${m[1]}.`],
  ];
  for (const [re, fn] of rules) {
    const m = t.match(re);
    if (m) return fn(m);
  }
  return `${t}… por ahora. ¿Qué habilidad concreta puedo practicar?`;
}

const PRESETS = ["No soy bueno con los negocios", "No sé invertir", "Soy un desastre con el presupuesto"];

export function GrowthTool() {
  const { state, update } = useAppState();
  const [fixed, setFixed] = useState("");
  const [f, setF] = useState({ event: "", lesson: "", cost: "", next: "" });

  const totalCost = state.growth.reduce((a, g) => a + (g.costLearned ?? 0), 0);

  const save = () => {
    if (!f.event.trim() || !f.lesson.trim()) return;
    update((s) => ({
      ...s,
      growth: [{ id: uid(), date: todayISO(), event: f.event.trim(), lesson: f.lesson.trim(),
        costLearned: f.cost ? Number(f.cost) : undefined, nextExperiment: f.next.trim() || undefined }, ...s.growth],
    }));
    setF({ event: "", lesson: "", cost: "", next: "" });
  };

  return (
    <div className="grid items-start gap-5 lg:grid-cols-2">
      <div className="space-y-5">
        <Card>
          <SectionTitle>El poder del «aún»</SectionTitle>
          <Field label="Escribe un juicio fijo sobre ti y el dinero" htmlFor="fixed">
            <Input id="fixed" value={fixed} onChange={(e) => setFixed(e.target.value)} placeholder="No soy bueno con los negocios" />
          </Field>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button key={p} onClick={() => setFixed(p)} className="rounded-full px-2.5 py-1 text-[11px] text-slate-400 ring-1 ring-white/10 hover:text-slate-200">{p}</button>
            ))}
          </div>
          {fixed.trim() && (
            <div className="mt-4 rounded-xl bg-emerald/10 p-4 ring-1 ring-emerald/20">
              <p className="text-[11px] uppercase tracking-wider text-emerald">Mentalidad de crecimiento</p>
              <p className="mt-1 text-base text-slate-100">{addYet(fixed)}</p>
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle>Registra un error como experimento</SectionTitle>
          <div className="space-y-3">
            <Field label="¿Qué pasó? (pérdida, error, decisión fallida)" htmlFor="ev">
              <Textarea id="ev" value={f.event} onChange={(e) => setF({ ...f, event: e.target.value })}
                placeholder="Invertí en algo que no entendía y perdí dinero." />
            </Field>
            <Field label="¿Qué aprendiste? ¿Qué harás distinto?" htmlFor="le">
              <Textarea id="le" value={f.lesson} onChange={(e) => setF({ ...f, lesson: e.target.value })}
                placeholder="Aún no sé analizar empresas; antes de invertir usaré la Matriz de 4 Preguntas." />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Coste de la lección (€)" htmlFor="co" hint="Lo que «pagaste» por aprender.">
                <Input id="co" type="number" min={0} inputMode="decimal" value={f.cost} onChange={(e) => setF({ ...f, cost: e.target.value })} />
              </Field>
              <Field label="Próximo experimento" htmlFor="nx" hint="Pequeño y seguro.">
                <Input id="nx" value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} placeholder="Invertir 50 € en un índice" />
              </Field>
            </div>
          </div>
          <Button className="mt-4 w-full" disabled={!f.event.trim() || !f.lesson.trim()} onClick={save}>Guardar experimento</Button>
        </Card>
      </div>

      <Card>
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-night-800/70 p-3">
            <p className="text-[11px] text-slate-500">Experimentos</p>
            <p className="text-2xl font-semibold text-slate-100">{state.growth.length}</p>
          </div>
          <div className="rounded-xl bg-night-800/70 p-3">
            <p className="text-[11px] text-slate-500">Invertido en aprender</p>
            <p className="text-2xl font-semibold text-gold">{formatMoney(totalCost)}</p>
          </div>
        </div>
        <SectionTitle>Laboratorio de aprendizaje</SectionTitle>
        {state.growth.length === 0 ? <Empty>Cada error registrado es una lección que no tendrás que pagar dos veces.</Empty> : (
          <ul className="space-y-3">
            {state.growth.map((g) => (
              <li key={g.id} className="rounded-xl bg-night-800/70 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-xs text-slate-400"><FlaskConical size={12} className="text-emerald" />{g.event}</p>
                  <button aria-label="Borrar" className="text-slate-600 hover:text-rose-300"
                    onClick={() => update((s) => ({ ...s, growth: s.growth.filter((x) => x.id !== g.id) }))}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="mt-1 text-sm text-slate-100">{g.lesson}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 text-[11px] text-slate-500">
                  {g.costLearned ? <span>Coste: {formatMoney(g.costLearned)}</span> : null}
                  {g.nextExperiment && <span>Siguiente: <span className="text-emerald">{g.nextExperiment}</span></span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
