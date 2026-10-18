import { ModulePage } from "@/components/modules/ModulePage";

const FEATURES = [
  "Registro de quejas, fricciones e ineficiencias",
  "Matriz queja → necesidad de mercado no resuelta",
  "Priorización por potencial"
];

export default function Page() {
  return <ModulePage slug="oportunidades" features={FEATURES} />;
}
