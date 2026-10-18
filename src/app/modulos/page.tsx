import { ModuleGrid } from "@/components/dashboard/ModuleGrid";

export const metadata = { title: "Módulos · MindWealth" };

export default function ModulesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-100">Todos los módulos</h1>
      <ModuleGrid />
    </div>
  );
}
