import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const tones = {
  good: "bg-emerald/10 text-emerald ring-emerald/20",
  warn: "bg-gold/10 text-gold ring-gold/20",
  bad: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
  neutral: "bg-white/5 text-slate-300 ring-white/10",
};

export function Badge({ tone = "neutral", children, className }: {
  tone?: keyof typeof tones; children: ReactNode; className?: string;
}) {
  return (
    <span className={cn("inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ring-1", tones[tone], className)}>
      {children}
    </span>
  );
}
