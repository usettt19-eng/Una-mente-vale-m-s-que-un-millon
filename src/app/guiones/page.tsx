import { ModulePage } from "@/components/modules/ModulePage";

const FEATURES = [
  "Evaluación de 12 preguntas (Evasión, Adoración, Estado, Vigilancia)",
  "Gráfico de radar del perfil",
  "Origen de patrones familiares",
  "Plan de calibración personalizado"
];

export default function Page() {
  return <ModulePage slug="guiones" features={FEATURES} />;
}
