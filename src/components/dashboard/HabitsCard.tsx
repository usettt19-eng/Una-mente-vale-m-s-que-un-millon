"use client";

import Link from "next/link";
import { AlertTriangle, Check, Flame, Repeat, Zap } from "lucide-react";
import type { AppState } from "@/lib/types";
import { habitStatus } from "@/lib/insights";
import { cn } from "@/lib/utils";
import { Card, CardHeader } from "@/components/ui/card";

export function HabitsCard({ state, onToggle }: { state: AppState; onToggle: (id: string) => void }) {
  const items = state.habits.map((h) => ({ h, s: habitStatus(h) }));
  const alerts = items.filter((i) => i.s.neverTwiceAlert);

  return (
    <Card>
      <CardHeader title="Sistemas y hábitos" subtitle="Módulo 9 · Nunca fallar dos veces" icon={<Repeat size={18} />} />
      {alerts.length > 0 && (
        <div className="mb-3 flex gap-2 rounded-xl bg-gold/10 p-3 text-xs text-gold-soft ring-1 ring-gold/20">
          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-gold" />
          <span>Ayer se rompió «{alerts[0].h.name}». Sin culpa: hazlo hoy en versión mínima para no fallar dos veces.</span>
        </div>
      )}
      <ul className="space-y-2">
        {items.map(({ h, s }) => (
          <li key={h.id}>
            <button onClick={() => onToggle(h.id)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-white/5">
              <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-md border",
                s.doneToday ? "border-emerald bg-emerald text-night-900" : "border-slate-600")}>
                {s.doneToday && <Check size={14} strokeWidth={3} />}
              </span>
              <span className={cn("flex-1 text-sm", s.doneToday ? "text-slate-400 line-through" : "text-slate-200")}>
                {h.name}
              </span>
              {h.automated && <Zap size={14} className="text-gold" aria-label="Automatizado" />}
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Flame size={12} className={s.streak > 0 ? "text-gold" : ""} />{s.streak}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p className="text-sm text-slate-400">Crea tu primer sistema automático.</p>}
      <Link href="/habitos" className="mt-3 inline-block text-xs font-medium text-emerald hover:underline">
        Gestionar sistemas →
      </Link>
    </Card>
  );
}
