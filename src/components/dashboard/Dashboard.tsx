"use client";

import { useAppState } from "@/lib/storage";
import { useMounted } from "@/lib/use-mounted";
import { todayISO } from "@/lib/utils";
import { MindIndexHero } from "./MindIndexHero";
import { BandwidthCard } from "./BandwidthCard";
import { ScriptRadarCard } from "./ScriptRadarCard";
import { IdentityCard, makeVote } from "./IdentityCard";
import { HabitsCard } from "./HabitsCard";
import { Action48Card } from "./Action48Card";
import { DecisionsCard } from "./DecisionsCard";
import { ResilienceCard } from "./ResilienceCard";
import { InsightsFeed } from "./InsightsFeed";
import { ModuleGrid } from "./ModuleGrid";

/**
 * Dashboard principal: conecta los 11 módulos en una sola vista.
 * Orden pensado para no saturar: primero el estado mental, luego la acción, luego el patrimonio.
 */
export function Dashboard() {
  const { state, isDemo, update, reset, startFresh } = useAppState();
  // Los datos dependen de la fecha/hora local y de localStorage: se pintan solo en el cliente.
  const mounted = useMounted();

  const addVote = (action: string) =>
    update((s) => ({ ...s, identity: { ...s.identity, votes: [...s.identity.votes, makeVote(action)] } }));

  const toggleHabit = (id: string) =>
    update((s) => ({
      ...s,
      habits: s.habits.map((h) => {
        if (h.id !== id) return h;
        const t = todayISO();
        return { ...h, log: h.log.includes(t) ? h.log.filter((d) => d !== t) : [...h.log, t] };
      }),
    }));

  const completeStep = (id: string) =>
    update((s) => ({ ...s, microSteps: s.microSteps.map((m) => (m.id === id ? { ...m, done: true } : m)) }));

  if (!mounted) return <DashboardSkeleton />;

  return (
    <div className="space-y-5">
      {isDemo ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-night-700/60 px-4 py-2.5 text-xs text-slate-400 ring-1 ring-white/5">
          <span>Estás viendo datos de ejemplo. Tus datos se guardan solo en este dispositivo.</span>
          <button onClick={startFresh} className="font-medium text-emerald hover:underline">
            Empezar con los míos
          </button>
        </div>
      ) : (
        <div className="flex justify-end">
          <button onClick={() => window.confirm("Se borrarán tus datos de este dispositivo. ¿Continuar?") && reset()} className="text-[11px] text-slate-500 hover:text-slate-300">Restablecer datos de ejemplo</button>
        </div>
      )}

      <MindIndexHero state={state} />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <BandwidthCard state={state} />
        <ScriptRadarCard state={state} />
        <IdentityCard state={state} onVote={addVote} />
        <HabitsCard state={state} onToggle={toggleHabit} />
        <Action48Card state={state} onDone={completeStep} />
        <DecisionsCard state={state} />
      </div>

      <ResilienceCard state={state} />
      <InsightsFeed state={state} />
      <ModuleGrid />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Cargando dashboard">
      <div className="h-48 animate-pulse rounded-2xl bg-night-700/60" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-night-700/40" />
        ))}
      </div>
    </div>
  );
}
