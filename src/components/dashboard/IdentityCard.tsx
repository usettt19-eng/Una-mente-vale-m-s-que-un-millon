"use client";

import { useState } from "react";
import { Fingerprint, Plus } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from "recharts";
import type { AppState } from "@/lib/types";
import { votesByDay } from "@/lib/insights";
import { uid } from "@/lib/storage";
import { todayISO } from "@/lib/utils";
import { Card, CardHeader } from "@/components/ui/card";

export function IdentityCard({ state, onVote }: { state: AppState; onVote: (action: string) => void }) {
  const [text, setText] = useState("");
  const data = votesByDay(state);
  const week = data.reduce((a, d) => a + d.votos, 0);
  const today = todayISO();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onVote(text.trim());
    setText("");
  };

  return (
    <Card>
      <CardHeader title="Identidad económica" subtitle={`Módulo 5 · ${week} votos esta semana`}
        icon={<Fingerprint size={18} />} />
      <blockquote className="rounded-xl border-l-2 border-gold bg-gold/5 px-3 py-2 text-sm italic text-slate-200">
        {state.identity.statement || "Define quién eliges ser con tu dinero."}
      </blockquote>
      <div className="mt-4 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Bar dataKey="votos" radius={[4, 4, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.date} fill={d.date === today ? "#F59E0B" : "#10B981"} fillOpacity={d.votos ? 0.9 : 0.2} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <label htmlFor="vote" className="sr-only">Nuevo voto de identidad</label>
        <input id="vote" value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Hoy voté por mi identidad al…"
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-night-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald/50 focus:outline-none" />
        <button type="submit" aria-label="Añadir voto"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald text-night-900 hover:bg-emerald/90">
          <Plus size={18} />
        </button>
      </form>
    </Card>
  );
}

export const makeVote = (action: string) => ({ id: uid(), date: todayISO(), action });
