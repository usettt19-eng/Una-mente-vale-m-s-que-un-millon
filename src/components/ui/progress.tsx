import { cn } from "@/lib/utils";

export function Progress({ value, tone = "emerald", className }: {
  value: number; tone?: "emerald" | "gold" | "rose"; className?: string;
}) {
  const color = { emerald: "bg-emerald", gold: "bg-gold", rose: "bg-rose-400" }[tone];
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-night-600/60", className)}
      role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}
    >
      <div className={cn("h-full rounded-full transition-all duration-700", color)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
