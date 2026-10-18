import { ModulePage } from "@/components/modules/ModulePage";

const FEATURES = [
  "Registro de errores y pérdidas como experimentos",
  "Reencuadre «aún no he desarrollado esta habilidad»",
  "Coste de aprendizaje acumulado"
];

export default function Page() {
  return <ModulePage slug="crecimiento" features={FEATURES} />;
}
