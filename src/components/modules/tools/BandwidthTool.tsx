"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Area, AreaChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAppState } from "@/lib/storage";
import { bandwidthScore, bandwidthStatus } from "@/lib/insights";
import { todayISO } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, Range, SectionTitle, Segmented } from "@/components/ui/form";

const TIPS = {
  good: [
    "Aprovecha para la decisión importante que tengas pendiente (Módulo 6).",
    "Revisa tu escudo de resiliencia o planifica la semana.",
  ],
  warn: [
    "Reduce opciones: elige entre 2 alternativas, no entre 10.",
    "Decide solo lo reversible; pon fecha a lo irreversible.",
    "Cierra un bucle abierto pequeño (un pago, un email) para liberar memoria.",
  ],
  bad: [
    "Pausa de 10 minutos: camina o respira antes de nada.",
    "No firmes, compres ni inviertas nada grande hoy.",
    "Escribe en una lista todo lo que te ronda: sacarlo de la cabeza libera ancho de banda.",
    "Duerme: el sueño es la forma más barata de recuperar capacidad.",
  ],
};

export function BandwidthTool() {
  const { state, update } = useAppState();
  const today = state.bandwidth.find((b) => b.date === todayISO());
  const [v, setV] = useState({
    sleep: today?.sleep ?? 3, stress: today?.stress ?? 3,
    moneyWorry: today?.moneyWorry ?? 3, openLoops: today?.openLoops ?? 5,
  });
  const [bigDecision, setBigDecision] = useState<"si" | "no">("no");
  const [saved, setSaved] = useState(false);

  const score = bandwidthScore(v);
  const status = bandwidthStatus(score);
  const set = (k: keyof typeof v) => (n: number) => { setV({ ...v, [k]: n }); setSaved(false); };

  const save = () => {
    const entry = { ...v, date: todayISO(), score };
    update((s) => ({
      ...s,
      bandwidth: [...s.bandwidth.filter((b) => b.date !== entry.date), entry]
        .sort((a, b) => a.date.localeCompare(b.date)),
    }));
    setSaved(true);
  };

  const history = state.bandwidth.slice(-14).map((b) => ({
    d: new Date(b.date + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
    score: b.score,
  }));
  const tone = { good: "text-emerald", warn: "text-gold", bad: "text-rose-300" }[status.tone];

  return (
    <div className="grid items-start gap-5 lg:grid-cols-2">
      <Card>
        <SectionTitle>Test de 30 segundos</SectionTitle>
        <div className="space-y-5">
          <Range id="sleep" label="¿Cómo dormiste?" value={v.sleep} onChange={set("sleep")} left="Fatal" right="Genial" />
          <Range id="stress" label="Nivel de estrés ahora" value={v.stress} onChange={set("stress")} left="Calma" right="Al límite" />
          <Range id="worry" label="Preocupación por dinero" value={v.moneyWorry} onChange={set("moneyWorry")} left="Ninguna" right="Constante" />
          <Range id="loops" label="Asuntos pendientes rondando tu cabeza" value={v.openLoops} onChange={set("openLoops")}
            min={0} max={10} left="0" right="10+" />
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-300">¿Tienes que tomar hoy una decisión financiera importante?</p>
            <Segmented label="Decisión importante hoy" value={bigDecision} onChange={setBigDecision}
              options={[{ value: "no", label: "No" }, { value: "si", label: "Sí" }]} />
          </div>
        </div>
        <Button className="mt-6 w-full" onClick={save}>
          {saved ? <><Check size={16} /> Guardado</> : today ? "Actualizar medición de hoy" : "Guardar medición de hoy"}
        </Button>
      </Card>

      <div className="space-y-5">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Capacidad mental disponible</p>
              <p className={`text-5xl font-semibold tabular-nums ${tone}`}>{score}</p>
            </div>
            <Badge tone={status.tone}>{status.label}</Badge>
          </div>
          <p className="mt-3 text-sm text-slate-200">{status.advice}</p>
          {bigDecision === "si" && status.tone !== "good" && (
            <div className="mt-3 rounded-xl bg-gold/10 p-3 text-xs text-gold-soft ring-1 ring-gold/20">
              Con este nivel de carga, la escasez estrecha tu visión. Si la decisión es irreversible, pospónla 24 h
              o pásala por la Matriz de 4 Preguntas.
            </div>
          )}
          <ul className="mt-4 space-y-2">
            {TIPS[status.tone].map((t) => (
              <li key={t} className="flex gap-2 text-sm text-slate-300"><span className="text-emerald">•</span>{t}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionTitle>Últimas mediciones</SectionTitle>
          {history.length ? (
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="bwh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                  <ReferenceLine y={45} stroke="#F59E0B" strokeDasharray="3 3" />
                  <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="score" name="Capacidad" stroke="#10B981" strokeWidth={2} fill="url(#bwh)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="text-sm text-slate-500">Aún no hay mediciones.</p>}
          <p className="mt-2 text-[11px] text-slate-500">Por debajo de la línea dorada (45) aparece la visión de túnel.</p>
        </Card>
      </div>
    </div>
  );
}
