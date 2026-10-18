"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import type { AppState, MoneyScript } from "@/lib/types";
import { SCRIPT_HINTS, SCRIPT_LABELS, dominantScript } from "@/lib/insights";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ScriptRadarCard({ state }: { state: AppState }) {
  const dom = dominantScript(state);
  const data = state.script
    ? (Object.keys(SCRIPT_LABELS) as MoneyScript[]).map((k) => ({
        script: SCRIPT_LABELS[k], value: state.script!.scores[k],
      }))
    : [];

  return (
    <Card>
      <CardHeader title="Guiones del dinero" subtitle="Módulo 1 · Tu piloto automático"
        icon={<Brain size={18} />}
        action={dom && <Badge tone="warn">{SCRIPT_LABELS[dom]}</Badge>} />
      {state.script ? (
        <>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} outerRadius="72%">
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="script" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Radar dataKey="value" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {dom && <p className="text-xs leading-relaxed text-slate-400">{SCRIPT_HINTS[dom]}</p>}
        </>
      ) : (
        <p className="text-sm text-slate-400">Descubre qué guion dirige tus decisiones sin que lo notes.</p>
      )}
      <Link href="/guiones" className="mt-3 inline-block text-xs font-medium text-emerald hover:underline">
        {state.script ? "Ver plan de calibración →" : "Empezar diagnóstico →"}
      </Link>
    </Card>
  );
}
