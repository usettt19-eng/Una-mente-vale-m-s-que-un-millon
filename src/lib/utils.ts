import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));

export const formatMoney = (n: number, currency = "EUR") =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);

/** Fecha local YYYY-MM-DD (no UTC: «hoy» cambia a la medianoche del usuario). */
export const localISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const todayISO = () => localISO(new Date());

export const daysBetween = (a: string, b: string) =>
  Math.round((new Date(b + "T12:00:00").getTime() - new Date(a + "T12:00:00").getTime()) / 86_400_000);
