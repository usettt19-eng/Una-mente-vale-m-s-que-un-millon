"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { AppState } from "@/lib/types";
import { mindIndex, nextBestAction } from "@/lib/insights";
import { Progress } from "@/components/ui/progress";

function greeting() {
  const h = new Date().getHours();
  return h < 13 ? "Buenos días" : h < 20 ? "Buenas tardes" : "Buenas noches";
}

export function MindIndexHero({ state }: { state: AppState }) {
  const { total, pillars } = mindIndex(state);
  const next = nextBestAction(state);
  const r = 44;
  const circ = 2 * Math.PI * r;

  return (
    <section className="grid gap-4 rounded-2xl border border-white/5 bg-gradient-to-br from-night-700 to-night-800 p-5 sm:p-6 lg:grid-cols-[auto_1fr]">
      <div className="flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r={r} className="fill-none stroke-night-600" strokeWidth="8" />
            <circle cx="50" cy="50" r={r} className="fill-none stroke-emerald transition-all duration-1000"
              strokeWidth="8" strokeLinecap="round" strokeDasharray={circ}
              strokeDashoffset={circ * (1 - total / 100)} />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-3xl font-semibold text-slate-50">{total}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">índice</p>
            </div>
          </div>
        </div>
        <div className="lg:hidden">
          <p className="text-sm text-slate-400">{greeting()}{state.userName ? `, ${state.userName}` : ""}</p>
          <h1 className="text-lg font-semibold text-slate-100">Tu Mente de Millón</h1>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="hidden lg:block">
          <p className="text-sm text-slate-400">{greeting()}{state.userName ? `, ${state.userName}` : ""}</p>
          <h1 className="text-2xl font-semibold text-slate-100">Tu Mente de Millón</h1>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.name}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-400">{p.name}</span>
                <span className="font-medium text-slate-200">{p.value}</span>
              </div>
              <Progress value={p.value} tone={p.value >= 60 ? "emerald" : "gold"} />
            </div>
          ))}
        </div>
        <Link href={next.href}
          className="group flex items-center gap-3 rounded-xl bg-gold/10 px-4 py-3 text-sm text-gold-soft ring-1 ring-gold/20 transition hover:bg-gold/15">
          <Sparkles size={16} className="shrink-0 text-gold" />
          <span className="flex-1"><span className="font-medium text-gold">Siguiente paso:</span> {next.text}</span>
          <ArrowRight size={16} className="shrink-0 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
