import type { AppState, BandwidthCheck, Habit, MoneyScript } from "./types";
import { clamp, daysBetween, todayISO } from "./utils";

export const SCRIPT_LABELS: Record<MoneyScript, string> = {
  evasion: "Evasión",
  adoracion: "Adoración",
  estado: "Estado",
  vigilancia: "Vigilancia",
};

export const SCRIPT_HINTS: Record<MoneyScript, string> = {
  evasion: "Tiendes a no mirar tus números. Calibra con 5 minutos semanales de revisión.",
  adoracion: "Esperas que más dinero lo resuelva todo. Define «suficiente» por escrito.",
  estado: "Asocias valor personal y patrimonio. Separa compras de identidad.",
  vigilancia: "Eres prudente, pero puede volverse ansiedad. Fija límites al control.",
};

/** Puntuación de ancho de banda cognitivo (0 = túnel total, 100 = mente despejada). */
export function bandwidthScore(c: Omit<BandwidthCheck, "score" | "date">) {
  const sleep = (c.sleep - 1) / 4;
  const calm = (5 - c.stress) / 4;
  const worry = (5 - c.moneyWorry) / 4;
  const loops = 1 - Math.min(c.openLoops, 10) / 10;
  return Math.round(clamp((sleep * 0.25 + calm * 0.3 + worry * 0.3 + loops * 0.15) * 100));
}

export function bandwidthStatus(score: number) {
  if (score >= 70) return { label: "Mente despejada", tone: "good" as const,
    advice: "Buen momento para decisiones importantes." };
  if (score >= 45) return { label: "Carga moderada", tone: "warn" as const,
    advice: "Decide lo reversible; aplaza lo irreversible o simplifica opciones." };
  return { label: "Visión de túnel", tone: "bad" as const,
    advice: "Pausa. No tomes decisiones financieras grandes hoy; cierra un bucle abierto." };
}

export function dominantScript(state: AppState): MoneyScript | null {
  if (!state.script) return null;
  return (Object.entries(state.script.scores) as [MoneyScript, number][])
    .sort((a, b) => b[1] - a[1])[0][0];
}

export function last7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date();
    x.setDate(x.getDate() - (6 - i));
    return x.toISOString().slice(0, 10);
  });
}

export function votesByDay(state: AppState) {
  return last7Days().map((date) => ({
    date,
    day: new Date(date + "T12:00:00").toLocaleDateString("es-ES", { weekday: "short" }).slice(0, 2),
    votos: state.identity.votes.filter((v) => v.date === date).length,
  }));
}

export function habitStatus(h: Habit) {
  const today = todayISO();
  const yesterday = last7Days()[5];
  const doneToday = h.log.includes(today);
  const missedYesterday = !h.log.includes(yesterday);
  let streak = 0;
  const cursor = new Date();
  if (!doneToday) cursor.setDate(cursor.getDate() - 1);
  while (h.log.includes(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  // Regla «Nunca fallar dos veces»: ayer fallaste y hoy aún no lo has hecho.
  const neverTwiceAlert = missedYesterday && !doneToday;
  return { doneToday, streak, neverTwiceAlert };
}

export function resilienceMetrics(state: AppState) {
  const r = state.resilience;
  const monthsCovered = r.monthlyExpenses > 0 ? r.emergencyFund / r.monthlyExpenses : 0;
  const fundPct = clamp((monthsCovered / r.targetMonths) * 100);

  const total = r.incomeSources.reduce((a, s) => a + s.monthly, 0);
  const largest = Math.max(0, ...r.incomeSources.map((s) => s.monthly));
  const dependency = total > 0 ? largest / total : 1;
  // 1 fuente = 0; varias fuentes y menor dependencia = más alto.
  const diversificationPct = r.incomeSources.length <= 1
    ? 0 : clamp(((1 - dependency) / 0.5) * 100);

  const daysSinceReview = r.lastReview ? daysBetween(r.lastReview, todayISO()) : null;
  const reviewDueIn = daysSinceReview === null ? 0 : r.reviewEveryDays - daysSinceReview;
  const reviewPct = daysSinceReview === null ? 0 : clamp((reviewDueIn / r.reviewEveryDays) * 100);

  return { monthsCovered, fundPct, total, dependency, diversificationPct, daysSinceReview, reviewDueIn, reviewPct };
}

export function microStepTimers(state: AppState) {
  return state.microSteps
    .filter((m) => !m.done)
    .map((m) => {
      const hoursLeft = 48 - (Date.now() - new Date(m.createdAt).getTime()) / 3_600_000;
      return { ...m, hoursLeft: Math.round(hoursLeft), expired: hoursLeft <= 0 };
    })
    .sort((a, b) => a.hoursLeft - b.hoursLeft);
}

/** Índice global "Mente de Millón" (0–100) que resume los cuatro pilares del libro. */
export function mindIndex(state: AppState) {
  const bw = state.bandwidth.at(-1)?.score ?? 50;

  const weekVotes = votesByDay(state).filter((d) => d.votos > 0).length;
  const identity = state.identity.statement ? (weekVotes / 7) * 100 : 0;

  const habits = state.habits.length
    ? (state.habits.reduce((a, h) => a + h.log.filter((d) => last7Days().includes(d)).length, 0) /
        (state.habits.length * 7)) * 100
    : 0;

  const r = resilienceMetrics(state);
  const resilience = (r.fundPct + r.diversificationPct + r.reviewPct) / 3;

  const pillars = [
    { name: "Mente", value: Math.round(bw) },
    { name: "Identidad", value: Math.round(identity) },
    { name: "Hábitos", value: Math.round(habits) },
    { name: "Resiliencia", value: Math.round(resilience) },
  ];
  const total = Math.round(pillars.reduce((a, p) => a + p.value, 0) / pillars.length);
  return { total, pillars };
}

/** Siguiente mejor acción: una sola sugerencia para no saturar al usuario. */
export function nextBestAction(state: AppState): { text: string; href: string } {
  if (!state.script) return { text: "Haz el diagnóstico de tus guiones del dinero (5 min).", href: "/guiones" };
  const today = todayISO();
  if (state.bandwidth.at(-1)?.date !== today)
    return { text: "Mide tu ancho de banda antes de decidir nada hoy.", href: "/ancho-de-banda" };
  const alert = state.habits.find((h) => habitStatus(h).neverTwiceAlert);
  if (alert) return { text: `Nunca falles dos veces: retoma «${alert.name}» hoy.`, href: "/habitos" };
  const step = microStepTimers(state)[0];
  if (step) return { text: `Micro-paso pendiente: ${step.step}.`, href: "/accion-48h" };
  const ready = state.decisions.find((d) => d.status === "abierta" && d.certainty >= 70);
  if (ready) return { text: `Ya tienes un ${ready.certainty}% de certeza en «${ready.title}». Decide.`, href: "/decisiones" };
  if (!state.identity.votes.some((v) => v.date === today))
    return { text: "Registra tu voto de identidad de hoy.", href: "/identidad" };
  return { text: "Todo en orden. Detecta una oportunidad en tu entorno.", href: "/oportunidades" };
}
