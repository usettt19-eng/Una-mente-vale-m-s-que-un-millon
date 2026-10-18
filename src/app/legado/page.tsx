import { ModulePage } from "@/components/modules/ModulePage";

const FEATURES = [
  "Guías y disparadores de conversación familiar",
  "Actividades de educación financiera por edades",
  "Mapa de patrones intergeneracionales a romper"
];

export default function Page() {
  return <ModulePage slug="legado" features={FEATURES} />;
}
