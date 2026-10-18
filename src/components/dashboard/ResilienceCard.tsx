"use client";

import Link from "next/link";
import { CalendarCheck, PiggyBank, Shield, Split } from "lucide-react";
import type { AppState } from "@/lib/types";
import { resilienceMetrics } from "@/lib/insights";
import { formatMoney } from "@/lib/utils";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ResilienceCard({ state }: { state: AppState }) {
  const m = resilienceMetrics(state);
  const r = state.resilience;

  const pillars = [
    { icon: PiggyBank, title: "Fondo de tranquilidad", value: m.fundPct,
      detail: `${m.monthsCovered.toFixed(1)} de ${r.targetMonths} meses · ${formatMoney(r.emergencyFund)}` },
    { icon: Split, title: "Diversificación de ingresos", value: m.diversificationPct,
      detail: `${r.incomeSources.length} fuentes · ${Math.round(m.dependency * 100)}% depende de la principal` },
    { icon: CalendarCheck, title: "Revisión periódica", value: m.reviewPct,
      detail: m.daysSinceReview === null ? "Sin revisión registrada"
        : m.reviewDueIn > 0 ? `Próxima revisión en ${m.reviewDueIn} días` : `Revisión atrasada ${-m.reviewDueIn} días` },
  ];

  return (
    <Card>
      <CardHeader title="Escudo de resiliencia" subtitle="Módulo 10 · Tres pilares" icon={<Shield size={18} />} />
      <div className="grid gap-4 sm:grid-cols-3">
        {pillars.map((p) => (
          <div key={p.title} className="rounded-xl bg-night-800/70 p-3">
            <div className="mb-2 flex items-center gap-2 text-slate-300">
              <p.icon size={15} className="text-emerald" />
              <span className="text-xs font-medium">{p.title}</span>
            </div>
            <Progress value={p.value} tone={p.value >= 60 ? "emerald" : p.value >= 30 ? "gold" : "rose"} />
            <p className="mt-2 text-[11px] text-slate-400">{p.detail}</p>
          </div>
        ))}
      </div>
      <Link href="/resiliencia" className="mt-3 inline-block text-xs font-medium text-emerald hover:underline">
        Actualizar escudo →
      </Link>
    </Card>
  );
}
