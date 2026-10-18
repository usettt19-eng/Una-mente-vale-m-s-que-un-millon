"use client";

import { useState } from "react";
import { MessageCircle, Trash2 } from "lucide-react";
import { useAppState, uid } from "@/lib/storage";
import { AGE_LESSONS, AUDIENCES, RULES, STARTERS, type Audience } from "@/lib/content/legacy";
import { todayISO } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button, Empty, Field, Input, SectionTitle, Segmented, Textarea } from "@/components/ui/form";

export function LegacyTool() {
  const { state, update } = useAppState();
  const [aud, setAud] = useState<Audience>("Pareja");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [p, setP] = useState({ inherited: "", keep: "", change: "" });
  const [age, setAge] = useState(AGE_LESSONS[1].age);

  const logConversation = () => {
    if (!topic.trim()) return;
    update((s) => ({ ...s, family: [{ id: uid(), date: todayISO(), topic: topic.trim(), with: aud, notes: notes.trim() || undefined }, ...s.family] }));
    setTopic("");
    setNotes("");
  };

  const addPattern = () => {
    if (!p.inherited.trim()) return;
    update((s) => ({ ...s, legacyPatterns: [{ id: uid(), inherited: p.inherited.trim(), keep: p.keep.trim(), change: p.change.trim() }, ...s.legacyPatterns] }));
    setP({ inherited: "", keep: "", change: "" });
  };

  const lessons = AGE_LESSONS.find((a) => a.age === age)!;

  return (
    <div className="grid items-start gap-5 lg:grid-cols-2">
      <div className="space-y-5">
        <Card>
          <SectionTitle>Conversaciones sin vergüenza</SectionTitle>
          <Segmented label="Con quién" value={aud} onChange={setAud} options={AUDIENCES.map((a) => ({ value: a, label: a }))} />
          <p className="mt-4 text-xs text-slate-500">Disparadores (toca uno para usarlo):</p>
          <ul className="mt-2 space-y-2">
            {STARTERS[aud].map((s) => (
              <li key={s}>
                <button onClick={() => setTopic(s)}
                  className="flex w-full gap-2 rounded-lg bg-night-800/70 px-3 py-2 text-left text-sm text-slate-200 ring-1 ring-white/5 hover:ring-emerald/40">
                  <MessageCircle size={14} className="mt-0.5 shrink-0 text-emerald" />{s}
                </button>
              </li>
            ))}
          </ul>
          <details className="mt-4 text-xs text-slate-400">
            <summary className="cursor-pointer text-slate-300">Reglas para que salga bien</summary>
            <ul className="mt-2 space-y-1">{RULES.map((r) => <li key={r}>• {r}</li>)}</ul>
          </details>
        </Card>

        <Card>
          <SectionTitle>Registrar conversación</SectionTitle>
          <div className="space-y-3">
            <Field label={`Tema hablado con: ${aud}`} htmlFor="tp">
              <Input id="tp" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Cómo repartimos los gastos de casa" />
            </Field>
            <Field label="Acuerdo o aprendizaje" htmlFor="nt">
              <Textarea id="nt" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Revisaremos juntos el presupuesto el primer domingo de cada mes." />
            </Field>
          </div>
          <Button className="mt-4 w-full" disabled={!topic.trim()} onClick={logConversation}>Guardar conversación</Button>
          {state.family.length > 0 && (
            <ul className="mt-4 divide-y divide-white/5">
              {state.family.map((f) => (
                <li key={f.id} className="flex items-start gap-2 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-200">{f.topic}</p>
                    <p className="text-[11px] text-slate-500">{f.with} · {new Date(f.date + "T12:00:00").toLocaleDateString("es-ES")}{f.notes ? ` · ${f.notes}` : ""}</p>
                  </div>
                  <button aria-label="Borrar" className="text-slate-600 hover:text-rose-300"
                    onClick={() => update((s) => ({ ...s, family: s.family.filter((x) => x.id !== f.id) }))}><Trash2 size={14} /></button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <SectionTitle>Romper patrones intergeneracionales</SectionTitle>
          <div className="space-y-3">
            <Field label="Lo que heredé" htmlFor="ih"><Input id="ih" value={p.inherited} onChange={(e) => setP({ ...p, inherited: e.target.value })} placeholder="El dinero era tabú y causaba peleas" /></Field>
            <Field label="Lo que conservo" htmlFor="kp"><Input id="kp" value={p.keep} onChange={(e) => setP({ ...p, keep: e.target.value })} placeholder="La austeridad y el esfuerzo" /></Field>
            <Field label="Lo que cambio" htmlFor="ch"><Input id="ch" value={p.change} onChange={(e) => setP({ ...p, change: e.target.value })} placeholder="Hablar de dinero con calma una vez al mes" /></Field>
          </div>
          <Button className="mt-4 w-full" disabled={!p.inherited.trim()} onClick={addPattern}>Añadir patrón</Button>
          <div className="mt-4 space-y-3">
            {state.legacyPatterns.length === 0 ? <Empty>Lo que no se nombra, se repite.</Empty> : state.legacyPatterns.map((l) => (
              <div key={l.id} className="relative rounded-xl bg-night-800/70 p-3 text-xs">
                <button aria-label="Borrar" className="absolute right-3 top-3 text-slate-600 hover:text-rose-300"
                  onClick={() => update((s) => ({ ...s, legacyPatterns: s.legacyPatterns.filter((x) => x.id !== l.id) }))}><Trash2 size={14} /></button>
                <p className="pr-6 text-slate-500"><span className="text-slate-400">Heredé:</span> {l.inherited}</p>
                {l.keep && <p className="mt-1 text-slate-300"><span className="text-emerald">Conservo:</span> {l.keep}</p>}
                {l.change && <p className="mt-1 text-slate-200"><span className="text-gold">Cambio:</span> {l.change}</p>}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Educación financiera por edades</SectionTitle>
          <Segmented label="Edad" value={age} onChange={setAge} options={AGE_LESSONS.map((a) => ({ value: a.age, label: a.age }))} />
          <ul className="mt-3 space-y-2">
            {lessons.lessons.map((l) => <li key={l} className="flex gap-2 text-sm text-slate-300"><span className="text-emerald">•</span>{l}</li>)}
          </ul>
        </Card>
      </div>
    </div>
  );
}
