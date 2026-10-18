import { ModulePage } from "@/components/modules/ModulePage";

const FEATURES = [
  "Descomponedor de metas en el micro-paso mínimo",
  "Cuenta atrás de 48 horas",
  "Temporizador de inicio rápido y recordatorios (efecto Zeigarnik)"
];

export default function Page() {
  return <ModulePage slug="accion-48h" features={FEATURES} />;
}
