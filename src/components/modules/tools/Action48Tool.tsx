"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Minimize2, Pause, Play, Trash2 } from "lucide-react";
import { useAppState, uid } from "@/lib/storage";
import { microStepTimers } from "@/lib/insights";
import type { MicroStep } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button, Empty, Field, Input, SectionTitle } from "@/components/ui/form";

const CHECKS = [
  "Lo puedo hacer en menos de 2 horas",
  "Depende solo de mí",
  "Es una acción física y visible (enviar, llamar, abrir, escribir)",
];

export function Action48Tool() {
  const { state, update } = useAppState();
  const [goal, setGoal] = useState("");
  const [step, setStep] = useState("");
  const [checks, setChecks] = useState<boolean[]>([false, false, false]);
  const [, tick] = useState(0);

  // Refresca la cuenta atrás cada minuto.
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  const add = () => {
    if (!goal.trim() || !step.trim()) return;
    update((s) => ({ ...s, microSteps: [...s.microSteps, { id: uid(), goal: goal.trim(), step: step.trim(), createdAt: new Date().toISOString(), done: false }] }));
    setStep("");
    setChecks([false, false, false]);
  };

  const active = microStepTimers(state);
  const done = state.microSteps.filter((m) => m.done).sort((a, b) => (b.doneAt ?? "").localeCompare(a.doneAt ?? ""));
  const allChecked = checks.every(Boolean);

  return (
    <div className="grid items-start gap-5 lg:grid-cols-2">
      <Card>
        <SectionTitle>Descompón tu meta</SectionTitle>
        <div className="space-y-3">
          <Field label="Meta financiera (grande y difusa está bien)" htmlFor="gl">
            <Input id="gl" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Crear un ingreso extra de 500 €/mes" />
          </Field>
          <Field label="¿Cuál es el paso más pequeño que puedes hacer en las próximas 48 h?" htmlFor="sp"
            hint="Si te da pereza empezarlo, todavía es demasiado grande.">
            <Input id="sp" value={step} onChange={(e) => setStep(e.target.value)} placeholder="Escribir a 1 persona que podría ser cliente" />
          </Field>
          <fieldset className="space-y-2 rounded-xl bg-night-800/70 p-3">
            <legend className="sr-only">Comprobación del micro-paso</legend>
            {CHECKS.map((c, i) => (
              <label key={c} className="flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                <input type="checkbox" className="accent-emerald" checked={checks[i]}
                  onChange={(e) => setChecks(checks.map((x, j) => (j === i ? e.target.checked : x)))} />
                {c}
              </label>
            ))}
          </fieldset>
          {!allChecked && step.trim() && (
            <p className="text-[11px] text-gold">Si no cumple las tres, hazlo más pequeño. Perfecto es enemigo de hecho.</p>
          )}
        </div>
        <Button className="mt-4 w-full" disabled={!goal.trim() || !step.trim()} onClick={add}>Comprometerme (48 h)</Button>
        <p className="mt-3 text-[11px] text-slate-500">
          Efecto Zeigarnik: una tarea empezada se queda abierta en tu mente y te empuja a terminarla. Lo difícil es empezar.
        </p>
      </Card>

      <div className="space-y-5">
        <Card>
          <SectionTitle>En marcha</SectionTitle>
          {active.length === 0 ? <Empty>Sin micro-pasos activos.</Empty> : (
            <ul className="space-y-3">{active.map((m) => <ActiveStep key={m.id} m={m} />)}</ul>
          )}
        </Card>
        {done.length > 0 && (
          <Card>
            <SectionTitle aside={<span className="text-xs text-emerald">{done.length} hechos</span>}>Completados</SectionTitle>
            <ul className="space-y-2">
              {done.slice(0, 10).map((m) => (
                <li key={m.id} className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 size={14} className="shrink-0 text-emerald" />
                  <span className="flex-1">{m.step}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}

function ActiveStep({ m }: { m: MicroStep & { hoursLeft: number; expired: boolean } }) {
  const { update } = useAppState();
  const [running, setRunning] = useState(false);
  const [secs, setSecs] = useState(300);
  const [shrinking, setShrinking] = useState(false);
  const [smaller, setSmaller] = useState("");

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [running]);
  useEffect(() => { if (secs === 0) setRunning(false); }, [secs]);

  const patch = (p: Partial<MicroStep>) => update((s) => ({ ...s, microSteps: s.microSteps.map((x) => (x.id === m.id ? { ...x, ...p } : x)) }));

  return (
    <li className="rounded-xl bg-night-800/70 p-3">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-slate-500">{m.goal}</p>
          <p className="text-sm text-slate-100">{m.step}</p>
        </div>
        <button aria-label="Borrar" className="text-slate-600 hover:text-rose-300"
          onClick={() => update((s) => ({ ...s, microSteps: s.microSteps.filter((x) => x.id !== m.id) }))}><Trash2 size={14} /></button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Progress value={(Math.max(0, m.hoursLeft) / 48) * 100} tone={m.hoursLeft < 12 ? "rose" : "gold"} />
        <span className="shrink-0 text-[11px] tabular-nums text-slate-400">{m.expired ? "vencido" : `${m.hoursLeft} h`}</span>
      </div>

      {running || secs < 300 ? (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-emerald/10 px-3 py-2">
          <span className="font-mono text-lg tabular-nums text-emerald">
            {String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}
          </span>
          <span className="text-[11px] text-slate-400">{secs === 0 ? "¡Ya has empezado! Sigue o márcalo hecho." : "Solo 5 minutos."}</span>
          <Button size="sm" variant="ghost" aria-label={running ? "Pausar" : "Reanudar"} onClick={() => setRunning(!running)}>
            {running ? <Pause size={14} /> : <Play size={14} />}
          </Button>
        </div>
      ) : null}

      {shrinking && (
        <form className="mt-3 flex gap-2" onSubmit={(e) => {
          e.preventDefault();
          if (!smaller.trim()) return;
          patch({ step: smaller.trim(), createdAt: new Date().toISOString() });
          setShrinking(false);
        }}>
          <label htmlFor={`sm-${m.id}`} className="sr-only">Versión más pequeña</label>
          <Input id={`sm-${m.id}`} value={smaller} onChange={(e) => setSmaller(e.target.value)} placeholder="Una versión aún más pequeña…" />
          <Button type="submit" size="sm">Reiniciar 48 h</Button>
        </form>
      )}

      <div className="mt-3 flex flex-wrap justify-end gap-2">
        {!running && secs === 300 && <Button size="sm" variant="subtle" onClick={() => setRunning(true)}><Play size={14} /> Empezar 5 min</Button>}
        <Button size="sm" variant="ghost" onClick={() => setShrinking(!shrinking)}><Minimize2 size={14} /> Más pequeño</Button>
        <Button size="sm" onClick={() => patch({ done: true, doneAt: new Date().toISOString() })}><CheckCircle2 size={14} /> Hecho</Button>
      </div>
    </li>
  );
}
