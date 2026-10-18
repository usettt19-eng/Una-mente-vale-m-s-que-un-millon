import { ModulePage } from "@/components/modules/ModulePage";

const FEATURES = [
  "Test rápido de capacidad mental (sueño, estrés, preocupación, bucles abiertos)",
  "Detección de visión de túnel y fatiga por escasez",
  "Recomendación automática de pausa o simplificación"
];

export default function Page() {
  return <ModulePage slug="ancho-de-banda" features={FEATURES} />;
}
