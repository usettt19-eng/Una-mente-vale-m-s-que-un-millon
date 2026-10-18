import type { AppState } from "./types";
import { localISO } from "./utils";

const d = (offset: number) => {
  const x = new Date();
  x.setDate(x.getDate() - offset);
  return localISO(x);
};
const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

/** Estado vacío para un usuario nuevo. */
export const EMPTY_STATE: AppState = {
  userName: "",
  script: null,
  bandwidth: [],
  beliefs: [],
  growth: [],
  identity: { statement: "", votes: [] },
  decisions: [],
  opportunities: [],
  microSteps: [],
  habits: [],
  resilience: {
    emergencyFund: 0,
    monthlyExpenses: 0,
    targetMonths: 6,
    incomeSources: [],
    lastReview: null,
    reviewEveryDays: 90,
  },
  family: [],
  legacyPatterns: [],
};

/** Datos de ejemplo para enseñar el Dashboard antes de que el usuario cargue los suyos. */
export const DEMO_STATE: AppState = {
  userName: "Alex",
  script: {
    completedAt: d(20),
    scores: { evasion: 62, adoracion: 38, estado: 27, vigilancia: 71 },
  },
  bandwidth: [
    { date: d(6), sleep: 3, stress: 4, moneyWorry: 4, openLoops: 9, score: 38 },
    { date: d(5), sleep: 3, stress: 4, moneyWorry: 3, openLoops: 8, score: 45 },
    { date: d(4), sleep: 4, stress: 3, moneyWorry: 3, openLoops: 6, score: 58 },
    { date: d(3), sleep: 4, stress: 3, moneyWorry: 3, openLoops: 5, score: 61 },
    { date: d(2), sleep: 3, stress: 3, moneyWorry: 2, openLoops: 5, score: 63 },
    { date: d(1), sleep: 4, stress: 2, moneyWorry: 2, openLoops: 4, score: 72 },
    { date: d(0), sleep: 4, stress: 2, moneyWorry: 2, openLoops: 3, score: 76 },
  ],
  beliefs: [
    { id: "b1", date: d(3), thought: "Nunca voy a salir de deudas.",
      bridge: "Estoy aprendiendo a reducir mis deudas paso a paso; este mes pago una más." },
    { id: "b2", date: d(9), thought: "El dinero es para gente con suerte.",
      bridge: "Hay personas que construyeron patrimonio con hábitos que yo también puedo practicar." },
  ],
  growth: [
    { id: "g1", date: d(12), event: "Compré acciones por impulso y perdí un 15%.",
      lesson: "Aún no domino el análisis; ahora uso la Matriz de 4 Preguntas antes de invertir.", costLearned: 300 },
  ],
  identity: {
    statement: "Soy un inversor disciplinado que decide con calma.",
    votes: [
      { id: "v1", date: d(6), action: "Revisé mis gastos semanales" },
      { id: "v2", date: d(5), action: "Aporté 50 € a mi fondo indexado" },
      { id: "v3", date: d(4), action: "Esperé 48 h antes de una compra" },
      { id: "v4", date: d(4), action: "Leí 20 páginas sobre finanzas" },
      { id: "v5", date: d(2), action: "Rechacé un gasto no alineado" },
      { id: "v6", date: d(1), action: "Automaticé el ahorro mensual" },
      { id: "v7", date: d(1), action: "Revisé mi fondo de emergencia" },
      { id: "v8", date: d(0), action: "Registré una creencia limitante" },
    ],
  },
  decisions: [
    { id: "dc1", createdAt: d(5), title: "¿Cambiar de trabajo a una startup?",
      stake: "Estabilidad vs. crecimiento profesional y salario +18%", reversible: false,
      worstCase: "La startup cierra en 12 meses", mitigation: "6 meses de fondo de emergencia antes de saltar",
      alignment: 4, certainty: 74, opportunityCost: 7200, indecisionCostPerWeek: 140, status: "abierta" },
    { id: "dc2", createdAt: d(2), title: "Comprar portátil nuevo",
      stake: "Productividad", reversible: true, worstCase: "Devolverlo en 14 días",
      mitigation: "Comprar con política de devolución", alignment: 3, certainty: 55, status: "abierta" },
  ],
  opportunities: [
    { id: "o1", date: d(3), complaint: "Nadie en mi barrio arregla bicis eléctricas.",
      need: "Servicio de reparación móvil de e-bikes", pain: 4, reach: 3 },
    { id: "o2", date: d(8), complaint: "Pierdo horas cuadrando facturas de autónomo.",
      need: "Plantilla/automatización contable sencilla para freelancers", pain: 3, reach: 4 },
  ],
  microSteps: [
    { id: "m1", goal: "Lanzar un ingreso extra", step: "Enviar 1 mensaje a un posible cliente",
      createdAt: hoursAgo(30), done: false },
    { id: "m2", goal: "Invertir con criterio", step: "Abrir cuenta en un bróker de bajo coste",
      createdAt: hoursAgo(10), done: false },
  ],
  habits: [
    { id: "h1", name: "Transferencia automática al ahorro", automated: true,
      automation: "150 € el día 1 de cada mes",
      log: [d(0), d(1), d(2), d(3), d(4), d(5), d(6)] },
    { id: "h2", name: "Registrar gastos del día", automated: false,
      minimal: "Anotar solo el gasto más grande del día",
      log: [d(2), d(3), d(4), d(6)] },
    { id: "h3", name: "10 min de educación financiera", automated: false,
      minimal: "Leer 1 página",
      log: [d(0), d(1), d(3), d(4), d(5)] },
  ],
  resilience: {
    emergencyFund: 6400,
    monthlyExpenses: 1600,
    targetMonths: 6,
    incomeSources: [
      { name: "Salario", monthly: 2300 },
      { name: "Freelance", monthly: 350 },
      { name: "Dividendos", monthly: 40 },
    ],
    lastReview: d(74),
    reviewEveryDays: 90,
  },
  family: [
    { id: "f1", date: d(15), topic: "Cómo hablábamos del dinero en casa", with: "Pareja" },
  ],
  legacyPatterns: [
    { id: "l1", inherited: "En casa el dinero era tema tabú y causaba discusiones.",
      keep: "La austeridad y el respeto por el esfuerzo.",
      change: "Hablar de dinero con calma una vez al mes, con números a la vista." },
  ],
};
