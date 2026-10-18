"use client";

import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { useAppState, uid } from "@/lib/storage";
import { cn, localISO, todayISO } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button, Field, Input, SectionTitle } from "@/components/ui/form";

const IDENTITIES = [
  "Soy un inversor disciplinado que decide con calma.",
  "Soy una persona que ahorra antes de gastar.",
  "Soy alguien que crea valor y cobra por ello.",
  "Soy una persona libre de deudas de consumo.",
];

const VOTE_IDEAS = [
  "Revisé mis gastos de la semana", "Aporté a mi inversión", "Esperé 48 h antes de comprar",
  "Leí sobre finanzas", "Dije no a un gasto no alineado", "Hablé de dinero con calma",
];

const iso = (offset: number) => {
  const x = new Date();
  x.setDate(x.getDate() - offset);
  return localISO(x);
};

export function IdentityTool() {
  const { state, update } = useAppState();
  const [statement, setStatement] = useState(state.identity.statement);
  const [name, setName] = useState(state.userName);
  const [vote, setVote] = useState("");
  const [savedId, setSavedId] = useState(false);

  const counts = new Map<string, number>();
  state.identity.votes.forEach((v) => counts.set(v.date, (counts.get(v.date) ?? 0) + 1));
  const days = Array.from({ length: 28 }, (_, i) => iso(27 - i));
  const activeDays = days.filter((d) => counts.has(d)).length;

  let streak = 0;
  for (let i = counts.has(todayISO()) ? 0 : 1; counts.has(iso(i)); i++) streak++;

  const addVote = (action: string) => {
    if (!action.trim()) return;
    update((s) => ({ ...s, identity: { ...s.identity, votes: [...s.identity.votes, { id: uid(), date: todayISO(), action: action.trim() }] } }));
    setVote("");
  };

  const saveIdentity = () => {
    update((s) => ({ ...s, userName: name.trim(), identity: { ...s.identity, statement: statement.trim() } }));
    setSavedId(true);
  };

  const recent = [...state.identity.votes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 15);

  return (
    <div className="grid items-start gap-5 lg:grid-cols-2">
      <div className="space-y-5">
        <Card>
          <SectionTitle>¿Quién eliges ser con tu dinero?</SectionTitle>
          <div className="space-y-3">
            <Field label="Tu nombre (para saludarte)" htmlFor="name">
              <Input id="name" value={name} onChange={(e) => { setName(e.target.value); setSavedId(false); }} />
            </Field>
            <Field label="Identidad económica en presente" htmlFor="stmt"
              hint="Empieza por «Soy…». Habla de quién eres, no de lo que quieres conseguir.">
              <Input id="stmt" value={statement} onChange={(e) => { setStatement(e.target.value); setSavedId(false); }}
                placeholder="Soy un inversor disciplinado" />
            </Field>
            <div className="flex flex-wrap gap-1.5">
              {IDENTITIES.map((i) => (
                <button key={i} onClick={() => { setStatement(i); setSavedId(false); }}
                  className="rounded-full px-2.5 py-1 text-left text-[11px] text-slate-400 ring-1 ring-white/10 hover:text-slate-200">{i}</button>
              ))}
            </div>
          </div>
          <Button className="mt-4 w-full" onClick={saveIdentity} disabled={!statement.trim()}>
            {savedId ? <><Check size={16} /> Guardado</> : "Guardar identidad"}
          </Button>
        </Card>

        <Card>
          <SectionTitle>Voto de hoy</SectionTitle>
          <p className="mb-3 text-xs text-slate-400">
            Cada acción, por pequeña que sea, es un voto por la persona que quieres ser. No necesitas unanimidad, solo mayoría.
          </p>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); addVote(vote); }}>
            <label htmlFor="vote2" className="sr-only">Acción</label>
            <Input id="vote2" value={vote} onChange={(e) => setVote(e.target.value)} placeholder="Hoy voté al…" />
            <Button type="submit" aria-label="Añadir voto" disabled={!vote.trim()}><Plus size={16} /></Button>
          </form>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {VOTE_IDEAS.map((v) => (
              <button key={v} onClick={() => addVote(v)}
                className="rounded-full px-2.5 py-1 text-[11px] text-slate-400 ring-1 ring-white/10 hover:bg-emerald/10 hover:text-emerald">+ {v}</button>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <div className="mb-4 grid grid-cols-3 gap-3 text-center">
            <Stat label="Racha" value={`${streak} d`} />
            <Stat label="Días con voto (28)" value={`${activeDays}`} />
            <Stat label="Votos totales" value={`${state.identity.votes.length}`} />
          </div>
          <div className="grid grid-cols-7 gap-1.5" aria-label="Votos de los últimos 28 días">
            {days.map((d) => {
              const c = counts.get(d) ?? 0;
              return (
                <div key={d} title={`${d}: ${c} votos`}
                  className={cn("aspect-square rounded-md",
                    c === 0 ? "bg-night-600/40" : c === 1 ? "bg-emerald/40" : c === 2 ? "bg-emerald/70" : "bg-emerald",
                    d === todayISO() && "ring-2 ring-gold")} />
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Últimas 4 semanas · el día de hoy está marcado en dorado.</p>
        </Card>

        <Card>
          <SectionTitle>Evidencias recientes</SectionTitle>
          <ul className="divide-y divide-white/5">
            {recent.map((v) => (
              <li key={v.id} className="flex items-center gap-3 py-2">
                <span className="w-14 shrink-0 text-[11px] text-slate-500">
                  {new Date(v.date + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                </span>
                <span className="flex-1 text-sm text-slate-200">{v.action}</span>
                <button aria-label="Borrar voto" className="text-slate-600 hover:text-rose-300"
                  onClick={() => update((s) => ({ ...s, identity: { ...s.identity, votes: s.identity.votes.filter((x) => x.id !== v.id) } }))}>
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
            {recent.length === 0 && <li className="py-2 text-sm text-slate-500">Aún no hay votos.</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-night-800/70 p-2">
      <p className="text-xl font-semibold text-slate-100">{value}</p>
      <p className="text-[10px] text-slate-500">{label}</p>
    </div>
  );
}
