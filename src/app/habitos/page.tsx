import { ModulePage } from "@/components/modules/ModulePage";

const FEATURES = [
  "Rutinas y transferencias automáticas a ahorro/inversión",
  "Rachas y registro diario",
  "Alerta amable «nunca fallar dos veces» con reajuste en 24 h"
];

export default function Page() {
  return <ModulePage slug="habitos" features={FEATURES} />;
}
