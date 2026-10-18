"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { MODULES, MODULE_GROUPS, type ModuleGroup } from "@/lib/modules";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const path = usePathname();
  const groups = Object.keys(MODULE_GROUPS) as ModuleGroup[];

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-white/5 bg-night-900 px-4 py-6 lg:block">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald/15 text-sm font-bold text-emerald">M</span>
        <span className="font-semibold tracking-tight text-slate-100">Mind<span className="text-gold">Wealth</span></span>
      </Link>

      <NavItem href="/" active={path === "/"} icon={<LayoutDashboard size={16} />} label="Dashboard" />

      {groups.map((g) => (
        <div key={g} className="mt-6">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">{MODULE_GROUPS[g]}</p>
          {MODULES.filter((m) => m.group === g).map((m) => (
            <NavItem key={m.slug} href={`/${m.slug}`} active={path === `/${m.slug}`}
              icon={<m.icon size={16} />} label={m.short} />
          ))}
        </div>
      ))}
    </aside>
  );
}

function NavItem({ href, active, icon, label }: { href: string; active: boolean; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors",
        active ? "bg-emerald/10 text-emerald" : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
      )}>
      {icon}
      {label}
    </Link>
  );
}
