"use client";

import Link from "next/link";
import { CheckCircle2, Timer } from "lucide-react";
import type { AppState } from "@/lib/types";
import { microStepTimers } from "@/lib/insights";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function Action48Card({ state, onDone }: { state: AppState; onDone: (id: string) => void }) {
  const steps = microStepTimers(state);
  return (
    <Card>
      <CardHeader title="Acción en 48 horas" subtitle="Módulo 8 · Hecho > perfecto" icon={<Timer size={18} />} />
      <ul className="space-y-3">
        {steps.map((s) => (
          <li key={s.id} className="rounded-xl bg-night-800/70 p-3">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-slate-500">{s.goal}</p>
                <p className="text-sm text-slate-100">{s.step}</p>
              </div>
              <button onClick={() => onDone(s.id)} aria-label="Marcar como hecho"
                className="text-slate-500 transition hover:text-emerald">
                <CheckCircle2 size={22} />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Progress value={(Math.max(0, s.hoursLeft) / 48) * 100} tone={s.hoursLeft < 12 ? "rose" : "gold"} />
              <span className="shrink-0 text-[11px] tabular-nums text-slate-400">
                {s.expired ? "vencido" : `${s.hoursLeft} h`}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {steps.length === 0 && (
        <p className="text-sm text-slate-400">Sin micro-pasos abiertos. Una tarea empezada no se olvida (Zeigarnik).</p>
      )}
      <Link href="/accion-48h" className="mt-3 inline-block text-xs font-medium text-emerald hover:underline">
        Descomponer una meta →
      </Link>
    </Card>
  );
}
