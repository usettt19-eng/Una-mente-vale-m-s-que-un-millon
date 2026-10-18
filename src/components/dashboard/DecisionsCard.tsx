"use client";

import Link from "next/link";
import { Scale } from "lucide-react";
import type { AppState } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DecisionsCard({ state }: { state: AppState }) {
  const open = state.decisions.filter((d) => d.status === "abierta");
  return (
    <Card>
      <CardHeader title="Decisiones abiertas" subtitle="Módulo 6 · Actúa con el 70% de certeza" icon={<Scale size={18} />} />
      <ul className="space-y-4">
        {open.map((d) => {
          const ready = d.certainty >= 70;
          return (
            <li key={d.id}>
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <p className="text-sm text-slate-100">{d.title}</p>
                <Badge tone={d.reversible ? "good" : "warn"}>{d.reversible ? "Reversible" : "Irreversible"}</Badge>
              </div>
              <div className="relative h-2 rounded-full bg-night-600/60">
                <div className={`h-full rounded-full ${ready ? "bg-emerald" : "bg-gold"}`} style={{ width: `${d.certainty}%` }} />
                <div className="absolute -top-1 h-4 w-px bg-slate-300" style={{ left: "70%" }} title="Umbral 70%" />
              </div>
              <div className="mt-1.5 flex flex-wrap justify-between gap-x-3 text-[11px] text-slate-400">
                <span>{d.certainty}% certeza {ready && <span className="text-emerald">· listo para decidir</span>}</span>
                {d.indecisionCostPerWeek ? <span>Indecisión: {formatMoney(d.indecisionCostPerWeek)}/sem</span> : null}
              </div>
            </li>
          );
        })}
      </ul>
      {open.length === 0 && <p className="text-sm text-slate-400">Ninguna decisión pendiente.</p>}
      <Link href="/decisiones" className="mt-3 inline-block text-xs font-medium text-emerald hover:underline">
        Nueva decisión con 4 preguntas →
      </Link>
    </Card>
  );
}
