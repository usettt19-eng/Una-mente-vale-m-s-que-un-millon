import { ModulePage } from "@/components/modules/ModulePage";

const FEATURES = [
  "Diario de pensamientos automáticos sobre el dinero",
  "Detector de lenguaje absolutista («nunca», «siempre»)",
  "Asistente para crear Creencias Puente realistas"
];

export default function Page() {
  return <ModulePage slug="creencias" features={FEATURES} />;
}
