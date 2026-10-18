"use client";

import type { ReactNode } from "react";
import { useMounted } from "@/lib/use-mounted";

export function ClientOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const mounted = useMounted();
  if (!mounted) return <>{fallback ?? <div className="h-64 animate-pulse rounded-2xl bg-night-700/40" />}</>;
  return <>{children}</>;
}
