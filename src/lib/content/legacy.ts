export const AUDIENCES = ["Pareja", "Hijos", "Padres", "Hermanos", "Amigos"] as const;
export type Audience = (typeof AUDIENCES)[number];

export const STARTERS: Record<Audience, string[]> = {
  Pareja: [
    "¿Qué te enseñaron en tu casa sobre el dinero sin decírtelo con palabras?",
    "Si tuviéramos un año sin preocupaciones económicas, ¿qué haríamos distinto?",
    "¿Qué compra te hace sentir culpa y cuál te hace sentir bien?",
    "¿Cuánto es «suficiente» para nosotros?",
  ],
  Hijos: [
    "¿De dónde crees que viene el dinero?",
    "Si tuvieras 10 €, ¿cuánto gastarías, cuánto guardarías y cuánto regalarías?",
    "¿Qué es algo que quieres de verdad y cuánto tiempo esperarías para tenerlo?",
    "Te cuento un error que cometí con el dinero y lo que aprendí.",
  ],
  Padres: [
    "¿Cómo era el dinero en vuestra casa cuando erais pequeños?",
    "¿Cuál fue la decisión económica de la que más os alegráis?",
    "¿Tenéis organizados vuestros papeles, testamento y deseos?",
    "¿Cómo podemos ayudarnos sin que el dinero sea un tema tenso?",
  ],
  Hermanos: [
    "¿Qué patrón de casa con el dinero quieres repetir y cuál no?",
    "¿Cómo nos organizaremos si nuestros padres necesitan ayuda?",
    "¿Qué recuerdo de dinero de la infancia te marcó?",
  ],
  Amigos: [
    "¿Qué hábito financiero te ha cambiado la vida?",
    "¿De qué tema de dinero te gustaría aprender este año?",
    "¿Hacemos un reto de ahorro juntos durante un mes?",
  ],
};

export const RULES = [
  "Elegid un momento tranquilo, no en medio de una discusión ni de una factura.",
  "Curiosidad antes que juicio: pregunta «¿por qué piensas eso?» en lugar de corregir.",
  "Habla en primera persona: «yo siento», «a mí me preocupa».",
  "Una conversación, un tema. Cerrad con un pequeño acuerdo concreto.",
];

export const AGE_LESSONS: { age: string; lessons: string[] }[] = [
  { age: "3–6 años", lessons: ["Tres huchas: gastar, ahorrar, compartir", "Esperar por algo que se desea (paciencia)", "Las cosas cuestan trabajo de alguien"] },
  { age: "7–12 años", lessons: ["Paga semanal con responsabilidad sobre un gasto", "Comparar precios en el súper", "Meta de ahorro con gráfico visible", "Necesidad vs. deseo"] },
  { age: "13–17 años", lessons: ["Primer presupuesto mensual", "Interés compuesto con ejemplos reales", "Publicidad y compras impulsivas", "Primer ingreso propio (trabajo o proyecto)"] },
  { age: "18+ años", lessons: ["Fondo de emergencia y primera cuenta de inversión", "Crédito y deudas: cuándo sí y cuándo no", "Negociar el salario", "Impuestos básicos"] },
];
