import type { MoneyScript } from "../types";

export interface ScriptQuestion { id: string; script: MoneyScript; text: string }

/** 12 afirmaciones (3 por guion) inspiradas en el modelo de Klontz. Escala 1–5. */
export const SCRIPT_QUESTIONS: ScriptQuestion[] = [
  { id: "e1", script: "evasion", text: "Prefiero no mirar el saldo de mi cuenta cuando sé que va justo." },
  { id: "a1", script: "adoracion", text: "Si tuviera más dinero, la mayoría de mis problemas desaparecerían." },
  { id: "s1", script: "estado", text: "Lo que una persona gana dice mucho de lo que vale." },
  { id: "v1", script: "vigilancia", text: "Me pongo nervioso si no sé exactamente cuánto tengo ahorrado." },
  { id: "e2", script: "evasion", text: "Siento que la gente rica suele haberse aprovechado de otros." },
  { id: "a2", script: "adoracion", text: "Nunca se tiene suficiente dinero; siempre hace falta un poco más." },
  { id: "s2", script: "estado", text: "Me cuesta no comprar algo cuando quiero causar buena impresión." },
  { id: "v2", script: "vigilancia", text: "Me resulta difícil gastar en mí, incluso cuando puedo permitírmelo." },
  { id: "e3", script: "evasion", text: "Hablar de dinero me incomoda y suelo cambiar de tema." },
  { id: "a3", script: "adoracion", text: "Con suficiente dinero por fin sería feliz y estaría en paz." },
  { id: "s3", script: "estado", text: "Me molesta que otros piensen que gano menos de lo que gano." },
  { id: "v3", script: "vigilancia", text: "No le cuento a casi nadie cuánto gano o cuánto tengo." },
];

export const LIKERT = [
  { value: 1, label: "Nada" },
  { value: 2, label: "Poco" },
  { value: 3, label: "A veces" },
  { value: 4, label: "Bastante" },
  { value: 5, label: "Totalmente" },
];

export const SCRIPT_DETAIL: Record<MoneyScript, {
  summary: string; risk: string; origin: string[]; plan: string[];
}> = {
  evasion: {
    summary: "Asocias el dinero con algo incómodo o poco ético y tiendes a evitarlo.",
    risk: "Facturas sin abrir, ahorro insuficiente y decisiones aplazadas hasta que es tarde.",
    origin: ["¿Se discutía por dinero en casa?", "¿Te decían que el dinero «corrompe» o que «los ricos son malos»?"],
    plan: [
      "Mira tu saldo 2 minutos cada lunes, sin juzgar el número",
      "Automatiza una transferencia de ahorro, aunque sea pequeña",
      "Escribe una Creencia Puente sobre el dinero y la ética",
    ],
  },
  adoracion: {
    summary: "Ves el dinero como la solución a casi todo y la fuente de felicidad.",
    risk: "Gasto impulsivo, deudas y sensación de que nunca es suficiente.",
    origin: ["¿Se vivía con carencia y se idealizaba a quien tenía dinero?", "¿Las recompensas en casa eran materiales?"],
    plan: [
      "Define por escrito cuánto es «suficiente» para ti este año",
      "Aplica una espera de 48 h antes de compras no planificadas",
      "Anota 3 fuentes de bienestar que no cuestan dinero",
    ],
  },
  estado: {
    summary: "Unes tu valor personal a tu patrimonio, tus ingresos o lo que muestras.",
    risk: "Gastar para aparentar, comparación constante y riesgo financiero por imagen.",
    origin: ["¿En tu familia se comparaban con otros por lo que tenían?", "¿Te sentías menos que otros por el dinero?"],
    plan: [
      "Antes de comprar, pregúntate: ¿lo compraría si nadie lo viera?",
      "Separa en tu identidad lo que eres de lo que tienes (Módulo 5)",
      "Revisa en qué gastaste el mes pasado para impresionar a alguien",
    ],
  },
  vigilancia: {
    summary: "Eres prudente y ahorrador, pero puedes vivirlo con ansiedad y secreto.",
    risk: "Ansiedad, dificultad para disfrutar y para invertir con riesgo razonable.",
    origin: ["¿Hubo una crisis económica en tu familia?", "¿Te enseñaron que el dinero es un asunto privado del que no se habla?"],
    plan: [
      "Fija un presupuesto de disfrute mensual y gástalo sin culpa",
      "Revisa tus cuentas solo en un horario fijo, no a todas horas",
      "Comparte tus metas financieras con una persona de confianza",
    ],
  },
};
