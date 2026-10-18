import { ModulePage } from "@/components/modules/ModulePage";

const FEATURES = [
  "Fondo de emergencia/tranquilidad en meses cubiertos",
  "Diversificación de fuentes de ingreso",
  "Calendario de revisiones periódicas"
];

export default function Page() {
  return <ModulePage slug="resiliencia" features={FEATURES} />;
}
