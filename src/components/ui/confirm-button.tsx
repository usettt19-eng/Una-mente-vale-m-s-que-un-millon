"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Botón con confirmación en dos pasos, sin diálogos del navegador. */
export function ConfirmButton({ onConfirm, children, question = "¿Seguro?", confirmLabel = "Sí, borrar", className, ariaLabel }: {
  onConfirm: () => void; children: ReactNode; question?: string; confirmLabel?: string; className?: string; ariaLabel?: string;
}) {
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return <button type="button" aria-label={ariaLabel} className={className} onClick={() => setAsking(true)}>{children}</button>;
  }
  return (
    <span className="inline-flex items-center gap-2 text-[11px]">
      <span className="text-slate-400">{question}</span>
      <button type="button" className={cn("rounded-md bg-rose-400/15 px-2 py-0.5 font-medium text-rose-300 hover:bg-rose-400/25")}
        onClick={() => { setAsking(false); onConfirm(); }}>{confirmLabel}</button>
      <button type="button" className="text-slate-400 hover:text-slate-200" onClick={() => setAsking(false)}>Cancelar</button>
    </span>
  );
}
