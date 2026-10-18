"use client";

import { cn } from "@/lib/utils";
import type {
  ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes,
} from "react";

const field =
  "w-full rounded-lg border border-white/10 bg-night-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald/50 focus:outline-none focus:ring-1 focus:ring-emerald/30";

export function Input({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(field, className)} {...p} />;
}

export function Textarea({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(field, "min-h-[80px] resize-y", className)} {...p} />;
}

export function Field({ label, hint, htmlFor, children, className }: {
  label: string; hint?: string; htmlFor?: string; children: ReactNode; className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-xs font-medium text-slate-300">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

const variants = {
  primary: "bg-emerald text-night-900 hover:bg-emerald/90 disabled:bg-emerald/30 disabled:text-night-700",
  gold: "bg-gold text-night-900 hover:bg-gold/90 disabled:opacity-40",
  ghost: "text-slate-300 hover:bg-white/5 disabled:opacity-40",
  subtle: "bg-white/5 text-slate-200 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-40",
  danger: "text-rose-300 hover:bg-rose-400/10",
};

export function Button({ variant = "primary", size = "md", className, ...p }:
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants; size?: "sm" | "md" }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition disabled:cursor-not-allowed",
        size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-4 py-2 text-sm",
        variants[variant], className,
      )}
      {...p}
    />
  );
}

/** Deslizador con valor visible y etiquetas en los extremos. */
export function Range({ id, label, value, onChange, min = 1, max = 5, step = 1, left, right, display }: {
  id: string; label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; left?: string; right?: string; display?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-xs font-medium text-slate-300">{label}</label>
        <span className="text-sm font-semibold tabular-nums text-emerald">{display ?? value}</span>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald" />
      {(left || right) && (
        <div className="flex justify-between text-[10px] text-slate-500"><span>{left}</span><span>{right}</span></div>
      )}
    </div>
  );
}

/** Selector segmentado (botones excluyentes). */
export function Segmented<T extends string | number>({ value, onChange, options, label }: {
  value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button key={String(o.value)} type="button" role="radio" aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn("rounded-lg px-3 py-1.5 text-xs font-medium ring-1 transition",
            value === o.value ? "bg-emerald/15 text-emerald ring-emerald/40" : "text-slate-400 ring-white/10 hover:bg-white/5")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed border-white/10 p-4 text-center text-sm text-slate-500">{children}</p>;
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="text-sm font-semibold text-slate-200">{children}</h2>
      {aside}
    </div>
  );
}
