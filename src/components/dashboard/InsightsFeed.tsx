"use client";

import Link from "next/link";
import { Lightbulb, Radar, RefreshCcw, Sprout, Users } from "lucide-react";
import type { AppState } from "@/lib/types";
import { Card, CardHeader } from "@/components/ui/card";

/** Resumen de los módulos de reflexión (3, 4, 7 y 11): lo último que has trabajado. */
export function InsightsFeed({ state }: { state: AppState }) {
  const belief = state.beliefs[0];
  const growth = state.growth[0];
  const opp = [...state.opportunities].sort((a, b) => b.potential - a.potential)[0];
  const fam = state.family[0];

  const items = [
    belief && { icon: RefreshCcw, href: "/creencias", label: "Creencia puente",
      before: belief.thought, after: belief.bridge },
    growth && { icon: Sprout, href: "/crecimiento", label: "Experimento de aprendizaje",
      before: growth.event, after: growth.lesson },
    opp && { icon: Radar, href: "/oportunidades", label: "Oportunidad detectada",
      before: opp.complaint, after: opp.need },
    { icon: Users, href: "/legado", label: "Conversación familiar",
      before: fam ? `Última: «${fam.topic}» con ${fam.with}` : "Aún no has tenido una conversación guiada.",
      after: "Pregunta de esta semana: ¿qué te enseñaron sin palabras sobre el dinero?" },
  ].filter(Boolean) as { icon: typeof Lightbulb; href: string; label: string; before: string; after: string }[];

  return (
    <Card>
      <CardHeader title="Reprogramación en curso" subtitle="Creencias, crecimiento, oportunidades y legado"
        icon={<Lightbulb size={18} />} />
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <li key={it.label}>
            <Link href={it.href} className="block h-full rounded-xl bg-night-800/70 p-3 transition hover:bg-night-800">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-300">
                <it.icon size={14} className="text-emerald" />{it.label}
              </div>
              <p className="text-xs text-slate-500 line-through decoration-slate-600">{it.before}</p>
              <p className="mt-1 text-sm text-slate-200">{it.after}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
