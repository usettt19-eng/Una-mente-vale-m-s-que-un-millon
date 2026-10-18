"use client";

import Link from "next/link";
import { Gauge } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AppState } from "@/lib/types";
import { bandwidthStatus } from "@/lib/insights";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BandwidthCard({ state }: { state: AppState }) {
  const last = state.bandwidth.at(-1);
  const data = state.bandwidth.slice(-7).map((b) => ({
    d: new Date(b.date + "T12:00:00").toLocaleDateString("es-ES", { weekday: "short" }).slice(0, 2),
    score: b.score,
  }));
  const status = last ? bandwidthStatus(last.score) : null;

  return (
    <Card>
      <CardHeader title="Ancho de banda cognitivo" subtitle="Módulo 2 · ¿Estás en visión de túnel?"
        icon={<Gauge size={18} />}
        action={status && <Badge tone={status.tone}>{status.label}</Badge>} />
      {last ? (
        <>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-semibold text-slate-50">{last.score}</span>
            <span className="mb-1 text-sm text-slate-500">/ 100</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{status?.advice}</p>
          <div className="mt-4 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="bw" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#94A3B8" }} formatter={(v: number) => [v, "Capacidad"]} />
                <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} fill="url(#bw)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-400">Aún no has medido tu capacidad mental.</p>
      )}
      <Link href="/ancho-de-banda" className="mt-3 inline-block text-xs font-medium text-emerald hover:underline">
        Hacer test rápido (30 s) →
      </Link>
    </Card>
  );
}
