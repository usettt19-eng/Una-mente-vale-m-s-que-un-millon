"use client";

import { useEffect, useState } from "react";

/** true solo tras montar en el cliente (evita desajustes de fecha/localStorage al hidratar). */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
