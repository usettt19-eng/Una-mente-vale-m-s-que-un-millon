import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getModule } from "@/lib/modules";
import { ClientOnly } from "@/components/ui/client-only";

/** Cabecera común de cada módulo + la herramienta interactiva (solo cliente). */
export function ModulePage({ slug, children }: { slug: string; children: React.ReactNode }) {
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
      <ClientOnly>{children}</ClientOnly>
    </div>
  );
}
