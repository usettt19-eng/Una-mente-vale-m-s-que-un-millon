import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getModule } from "@/lib/modules";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Plantilla común de cada módulo. Cada carpeta de src/app/<modulo>
 * sustituirá `children` por su herramienta interactiva.
 */
export function ModulePage({ slug, features, children }: {
  slug: string; features: string[]; children?: React.ReactNode;
}) {
  const m = getModule(slug);
  if (!m) return null;
  return (
    <div className="space-y-6">
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
        <ArrowLeft size={14} /> Dashboard
      </Link>
      <header className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald/10 text-emerald">
          <m.icon size={22} />
        </div>
        <div>
          <p className="text-xs text-slate-500">Módulo {m.id} · {m.concept}</p>
          <h1 className="text-xl font-semibold text-slate-100 sm:text-2xl">{m.title}</h1>
          <p className="mt-1 text-sm text-slate-400">{m.description}</p>
        </div>
      </header>
      {children ?? (
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-200">Herramientas de este módulo</h2>
            <Badge tone="warn">Próximamente</Badge>
          </div>
          <ul className="space-y-2 text-sm text-slate-400">
            {features.map((f) => (
              <li key={f} className="flex gap-2"><span className="text-emerald">•</span>{f}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
