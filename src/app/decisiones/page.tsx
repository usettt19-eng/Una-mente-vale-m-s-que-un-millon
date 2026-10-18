import { ModulePage } from "@/components/modules/ModulePage";

const FEATURES = [
  "Las 4 preguntas: qué está en juego, reversible/irreversible, peor escenario, alineación futura",
  "Calculadora de costo de oportunidad y de indecisión",
  "Alerta de información suficiente al 70% de certeza"
];

export default function Page() {
  return <ModulePage slug="decisiones" features={FEATURES} />;
}
