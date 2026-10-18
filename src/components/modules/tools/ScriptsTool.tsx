"use client";

import { useState } from "react";
import { Check, Plus, RotateCcw } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { useAppState, uid } from "@/lib/storage";
import { LIKERT, SCRIPT_DETAIL, SCRIPT_QUESTIONS } from "@/lib/content/scripts";
import { SCRIPT_LABELS } from "@/lib/insights";
import type { MoneyScript } from "@/lib/types";
import { todayISO } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button, Field, SectionTitle, Textarea } from "@/components/ui/form";

const ORDER: MoneyScript[] = ["evasion", "adoracion", "estado", "vigilancia"];

function score(answers: Record<string, number>) {
  return Object.fromEntries(ORDER.map((s) => {
    const qs = SCRIPT_QUESTIONS.filter((q) => q.script === s);
    const sum = qs.reduce((a, q) => a + (answers[q.id] ?? 1), 0);
    return [s, Math.round(((sum - qs.length) / (qs.length * 4)) * 100)];
  })) as Record<MoneyScript, number>;
}

export function ScriptsTool() {
  const { state, update } = useAppState();
  const [taking, setTaking] = useState(!state.script);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [i, setI] = useState(0);

  if (taking) {
    const q = SCRIPT_QUESTIONS[i];
    const answer = (v: number) => {
      const next = { ...answers, [q.id]: v };
      setAnswers(next);
      if (i < SCRIPT_QUESTIONS.length - 1) {
        setI(i + 1);
        return;
      }
      update((s) => ({ ...s, script: {
        completedAt: todayISO(), scores: score(next), answers: next, familyOrigin: s.script?.familyOrigin,
      } }));
      setTaking(false);
      setI(0);
    };
    return (
      <Card className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center gap-3">
          <Progress value={(i / SCRIPT_QUESTIONS.length) * 100} />
          <span className="shrink-0 text-xs tabular-nums text-slate-400">{i + 1}/{SCRIPT_QUESTIONS.length}</span>
        </div>
        <p className="mb-1 text-xs text-slate-500">¿Cuánto te identificas con esta frase?</p>
        <p className="mb-6 text-lg leading-snug text-slate-100">{q.text}</p>
        <div className="grid grid-cols-5 gap-2">
          {LIKERT.map((l) => (
            <button key={l.value} onClick={() => answer(l.value)}
              className={`flex flex-col items-center gap-1 rounded-xl py-3 text-xs ring-1 transition hover:bg-emerald/10 hover:ring-emerald/40 ${
                answers[q.id] === l.value ? "bg-emerald/15 text-emerald ring-emerald/40" : "text-slate-300 ring-white/10"}`}>
              <span className="text-base font-semibold">{l.value}</span>
              <span className="text-[10px] text-slate-400">{l.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-between">
          <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => setI(i - 1)}>Anterior</Button>
          {state.script && <Button variant="ghost" size="sm" onClick={() => setTaking(false)}>Cancelar</Button>}
        </div>
        <p className="mt-4 text-[11px] text-slate-500">
          No hay respuestas buenas ni malas: los guiones son aprendidos, no defectos. Responde por instinto.
        </p>
      </Card>
    );
  }

  const profile = state.script!;
  const ranked = [...ORDER].sort((a, b) => profile.scores[b] - profile.scores[a]);
  const dom = ranked[0];
  const detail = SCRIPT_DETAIL[dom];
  const data = ORDER.map((s) => ({ script: SCRIPT_LABELS[s], value: profile.scores[s] }));
  const planned = new Set(state.microSteps.map((m) => m.step));

  const addStep = (step: string) => update((s) => ({
    ...s,
    microSteps: [...s.microSteps, { id: uid(), goal: `Calibrar guion: ${SCRIPT_LABELS[dom]}`, step,
      createdAt: new Date().toISOString(), done: false }],
  }));

  return (
    <div className="grid items-start gap-5 lg:grid-cols-2">
      <Card>
        <SectionTitle aside={<Badge tone="warn">Dominante: {SCRIPT_LABELS[dom]}</Badge>}>Tu perfil</SectionTitle>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="72%">
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="script" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <Radar dataKey="value" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <ul className="mt-2 space-y-2">
          {ranked.map((s) => (
            <li key={s}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-300">{SCRIPT_LABELS[s]}</span>
                <span className="tabular-nums text-slate-400">{profile.scores[s]}</span>
              </div>
              <Progress value={profile.scores[s]} tone={s === dom ? "gold" : "emerald"} />
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
          <span>Hecho el {new Date(profile.completedAt + "T12:00:00").toLocaleDateString("es-ES")}</span>
          <Button variant="ghost" size="sm" onClick={() => { setAnswers(profile.answers ?? {}); setTaking(true); }}>
            <RotateCcw size={14} /> Repetir
          </Button>
        </div>
      </Card>

      <div className="space-y-5">
        <Card>
          <SectionTitle>Qué significa</SectionTitle>
          <p className="text-sm text-slate-200">{detail.summary}</p>
          <p className="mt-2 text-xs text-slate-400"><span className="text-gold">Riesgo:</span> {detail.risk}</p>
        </Card>

        <Card>
          <SectionTitle>Origen del patrón</SectionTitle>
          <ul className="mb-3 space-y-1 text-xs text-slate-400">
            {detail.origin.map((o) => <li key={o}>• {o}</li>)}
          </ul>
          <Field label="¿Qué frases sobre dinero escuchabas en casa?" htmlFor="origin">
            <Textarea id="origin" defaultValue={profile.familyOrigin ?? ""}
              placeholder="«El dinero no crece en los árboles», «de eso no se habla»…"
              onBlur={(e) => update((s) => ({ ...s, script: s.script && { ...s.script, familyOrigin: e.target.value } }))} />
          </Field>
          <p className="mt-1 text-[11px] text-slate-500">Se guarda al salir del campo.</p>
        </Card>

        <Card>
          <SectionTitle>Plan de calibración</SectionTitle>
          <ul className="space-y-2">
            {detail.plan.map((p) => (
              <li key={p} className="flex items-center gap-3 rounded-xl bg-night-800/70 p-3">
                <span className="flex-1 text-sm text-slate-200">{p}</span>
                {planned.has(p) ? (
                  <span className="flex items-center gap-1 text-xs text-emerald"><Check size={14} /> En 48 h</span>
                ) : (
                  <Button variant="subtle" size="sm" onClick={() => addStep(p)}><Plus size={14} /> 48 h</Button>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-slate-500">«48 h» lo convierte en un micro-paso del Módulo 8.</p>
        </Card>
      </div>
    </div>
  );
}
