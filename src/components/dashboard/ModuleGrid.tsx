import Link from "next/link";
import { MODULES } from "@/lib/modules";

export function ModuleGrid() {
  return (
    <section aria-labelledby="modules-title">
      <h2 id="modules-title" className="mb-3 text-sm font-semibold text-slate-300">Los 11 módulos del método</h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {MODULES.map((m) => (
          <li key={m.slug}>
            <Link href={`/${m.slug}`}
              className="flex h-full flex-col gap-2 rounded-xl border border-white/5 bg-night-700/40 p-3 transition hover:border-emerald/30 hover:bg-night-700/70">
              <div className="flex items-center justify-between">
                <m.icon size={18} className="text-emerald" />
                <span className="text-[10px] text-slate-500">{String(m.id).padStart(2, "0")}</span>
              </div>
              <p className="text-sm font-medium text-slate-100">{m.short}</p>
              <p className="line-clamp-2 text-[11px] leading-snug text-slate-400">{m.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
