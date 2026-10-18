"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { AppState } from "./types";
import { DEMO_STATE, EMPTY_STATE } from "./demo-data";

/**
 * Almacén local (privacidad total): los datos nunca salen del dispositivo.
 * Si el usuario aún no ha guardado nada, se muestran datos de ejemplo.
 */
const KEY = "mindwealth:v1";
type Listener = () => void;
const listeners = new Set<Listener>();

let cache: { state: AppState; isDemo: boolean } | null = null;

function read(): { state: AppState; isDemo: boolean } {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      cache = { state: { ...EMPTY_STATE, ...JSON.parse(raw) }, isDemo: false };
      return cache;
    }
  } catch {
    /* almacenamiento no disponible: seguimos con datos de ejemplo */
  }
  cache = { state: DEMO_STATE, isDemo: true };
  return cache;
}

function write(state: AppState) {
  cache = { state, isDemo: false };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* sin persistencia en este navegador */
  }
  listeners.forEach((l) => l());
}

const SERVER_SNAPSHOT = { state: DEMO_STATE, isDemo: true };

function subscribe(l: Listener) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAppState() {
  const snap = useSyncExternalStore(subscribe, read, () => SERVER_SNAPSHOT);

  const update = useCallback((fn: (s: AppState) => AppState) => {
    write(fn(read().state));
  }, []);

  /** Borra el ejemplo y empieza con un estado vacío propio. */
  const startFresh = useCallback(() => write(EMPTY_STATE), []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* nada que borrar */
    }
    cache = null;
    listeners.forEach((l) => l());
  }, []);

  return { state: snap.state, isDemo: snap.isDemo, update, reset, startFresh };
}

export const uid = () => Math.random().toString(36).slice(2, 10);
