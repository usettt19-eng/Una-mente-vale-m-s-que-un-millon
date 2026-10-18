import type { Decision } from "../types";

export type Verdict = { tone: "good" | "warn" | "bad"; title: string; text: string };

/** Veredicto de la matriz: combina reversibilidad, certeza (regla del 70%), alineación y ancho de banda. */
export function verdict(d: Pick<Decision, "reversible" | "certainty" | "alignment">, bandwidth?: number): Verdict {
  if (bandwidth !== undefined && bandwidth < 45 && !d.reversible)
    return { tone: "bad", title: "Espera 24 h", text: "Tu ancho de banda está bajo y la decisión es irreversible. Duerme sobre ella y vuelve a medirte." };
  if (d.alignment <= 2)
    return { tone: "bad", title: "Probablemente no", text: "No está alineada con la persona que quieres ser. Si aun así la tomas, que sea consciente." };
  if (d.certainty >= 70)
    return { tone: "good", title: "Información suficiente: decide", text: "Esperar a tener el 100% suele costar más que equivocarse un poco. Actúa y ajusta." };
  if (d.reversible && d.certainty >= 50)
    return { tone: "good", title: "Pruébalo y corrige", text: "Es reversible: el coste de equivocarte es bajo. Decide rápido y aprende del resultado." };
  return { tone: "warn", title: "Busca lo que falta, con fecha límite", text: "Identifica el dato concreto que te falta para llegar al 70% y ponte un plazo para conseguirlo." };
}

export const STEPS = [
  { n: 1, title: "¿Qué está realmente en juego?" },
  { n: 2, title: "¿Es reversible o irreversible?" },
  { n: 3, title: "Peor escenario realista y plan B" },
  { n: 4, title: "¿Te acerca a tu versión futura?" },
] as const;
