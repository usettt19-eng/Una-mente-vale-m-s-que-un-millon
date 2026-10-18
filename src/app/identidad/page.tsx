import { ModulePage } from "@/components/modules/ModulePage";

const FEATURES = [
  "Definición de la identidad financiera elegida",
  "Registro diario de votos de evidencia",
  "Historial y racha de votos"
];

export default function Page() {
  return <ModulePage slug="identidad" features={FEATURES} />;
}
