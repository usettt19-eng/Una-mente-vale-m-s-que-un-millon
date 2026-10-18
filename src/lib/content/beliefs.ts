/** Detección de distorsiones y sugerencia de Creencias Puente (sin IA: reglas simples y transparentes). */

export const DISTORTIONS: { pattern: RegExp; label: string; tip: string }[] = [
  { pattern: /\b(nunca|jam[aá]s)\b/i, label: "Absolutismo («nunca»)", tip: "¿Nunca, o todavía no?" },
  { pattern: /\b(siempre)\b/i, label: "Absolutismo («siempre»)", tip: "¿Siempre, o a veces?" },
  { pattern: /\b(todo|todos|nada|nadie|ning[uú]n)\b/i, label: "Generalización", tip: "¿Hay alguna excepción?" },
  { pattern: /\b(no puedo|imposible|no soy capaz)\b/i, label: "Indefensión", tip: "¿Qué parte sí está en tu mano?" },
  { pattern: /\b(no me alcanza|no llega|no hay dinero|no tengo dinero)\b/i, label: "Escasez", tip: "¿Qué recurso sí tienes hoy?" },
  { pattern: /\b(no merezco|no soy de los que|no es para m[ií])(?![\wáéíóúñ])/i, label: "Identidad limitante", tip: "¿Quién decidió eso?" },
  { pattern: /\b(soy malo|soy un desastre|soy p[eé]simo)\b/i, label: "Etiqueta fija", tip: "Es una habilidad, no tu identidad." },
];

const REPLACEMENTS: [RegExp, string][] = [
  [/\b(nunca|jam[aá]s) tendr[eé](?![\wáéíóúñ])/gi, "todavía no tengo"],
  [/\b(nunca|jam[aá]s) ser[eé](?![\wáéíóúñ])/gi, "todavía no soy"],
  [/\bnunca voy a poder\b/gi, "todavía no he logrado"],
  [/\bnunca voy a\b/gi, "todavía no he aprendido a"],
  [/\bnunca\b/gi, "todavía no"],
  [/\bjam[aá]s\b/gi, "todavía no"],
  [/\bsiempre\b/gi, "a veces"],
  [/\bno puedo con\b/gi, "estoy aprendiendo a gestionar"],
  [/\bno puedo\b/gi, "aún no sé cómo"],
  [/\bno soy capaz de\b/gi, "estoy desarrollando la capacidad de"],
  [/\bimposible\b/gi, "difícil por ahora"],
  [/\bsoy malo con\b/gi, "aún no domino"],
  [/\bsoy un desastre con\b/gi, "estoy mejorando con"],
  [/\bno merezco\b/gi, "me estoy permitiendo"],
  [/\bnadie\b/gi, "pocas personas"],
];

export function detect(thought: string) {
  return DISTORTIONS.filter((d) => d.pattern.test(thought));
}

/** Propuestas de Creencia Puente: realista, progresiva y creíble para el propio usuario. */
export function suggestBridges(thought: string): string[] {
  const t = thought.trim().replace(/[.!]+$/, "");
  if (!t) return [];
  let softened = t;
  for (const [re, rep] of REPLACEMENTS) softened = softened.replace(re, rep);
  const lower = t.charAt(0).toLowerCase() + t.slice(1);
  const out = [
    softened !== t ? softened.charAt(0).toUpperCase() + softened.slice(1) + "." : null,
    `Aunque a veces pienso que ${lower}, estoy dando pequeños pasos para cambiarlo.`,
    `Estoy aprendiendo a relacionarme con el dinero de otra forma; esta semana daré un paso concreto.`,
    `Es posible que lo que creo ahora («${t}») cambie a medida que acumule pruebas de lo contrario.`,
  ].filter(Boolean) as string[];
  return Array.from(new Set(out));
}

export const BRIDGE_CHECK = [
  "¿Me la creo al menos un 60%?",
  "¿Describe un proceso («estoy aprendiendo») y no un milagro?",
  "¿Me invita a una acción concreta esta semana?",
];
