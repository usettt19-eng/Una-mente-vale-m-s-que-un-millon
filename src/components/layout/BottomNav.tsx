"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, LayoutDashboard, LayoutGrid, Repeat, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Inicio", icon: LayoutDashboard },
  { href: "/ancho-de-banda", label: "Mente", icon: Gauge },
  { href: "/decisiones", label: "Decidir", icon: Scale },
  { href: "/habitos", label: "Hábitos", icon: Repeat },
  { href: "/modulos", label: "Módulos", icon: LayoutGrid },
];

/** Navegación inferior para móvil (pulgar-first). */
export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/5 bg-night-900/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined}
                className={cn("flex flex-col items-center gap-1 py-2.5 text-[10px]",
                  active ? "text-emerald" : "text-slate-500")}>
                <Icon size={20} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
