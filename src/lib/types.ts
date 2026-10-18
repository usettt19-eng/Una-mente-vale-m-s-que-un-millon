// Modelo de datos de MindWealth. Todo se guarda en el dispositivo (localStorage).

export type MoneyScript = "evasion" | "adoracion" | "estado" | "vigilancia";

export interface ScriptProfile {
  completedAt: string;
  scores: Record<MoneyScript, number>; // 0–100
  answers?: Record<string, number>;      // id de pregunta → 1–5
  familyOrigin?: string;                 // frases que escuchabas en casa
}

export interface BandwidthCheck {
  date: string;
  sleep: number;      // 1–5
  stress: number;     // 1–5 (5 = mucho estrés)
  moneyWorry: number; // 1–5
  openLoops: number;  // tareas abiertas en la cabeza
  score: number;      // 0–100 calculado
}

export interface BeliefEntry {
  id: string;
  date: string;
  thought: string;
  bridge: string;
}

export interface GrowthExperiment {
  id: string;
  date: string;
  event: string;
  lesson: string;
  costLearned?: number;
  nextExperiment?: string;
}

export interface IdentityVote {
  id: string;
  date: string;
  action: string;
}

export interface Identity {
  statement: string;
  votes: IdentityVote[];
}

export interface Decision {
  id: string;
  createdAt: string;
  title: string;
  stake: string;
  reversible: boolean;
  worstCase: string;
  mitigation: string;
  alignment: number; // 1–5
  certainty: number; // 0–100
  opportunityCost?: number;
  indecisionCostPerWeek?: number;
  futureSelf?: string;
  deadline?: string;
  status: "abierta" | "decidida";
  choice?: string;
  decidedAt?: string;
}

export interface Opportunity {
  id: string;
  date: string;
  complaint: string;
  need: string;
  pain: number;  // 1–5: cuánto duele el problema
  reach: number; // 1–5: cuántas personas lo sufren
}

export interface MicroStep {
  id: string;
  goal: string;
  step: string;
  createdAt: string; // ISO completo, para la cuenta atrás de 48 h
  done: boolean;
  doneAt?: string;
}

export interface Habit {
  id: string;
  name: string;
  automated: boolean;
  log: string[]; // fechas YYYY-MM-DD cumplidas
  minimal?: string;    // versión mínima (2 min) para no fallar dos veces
  automation?: string; // ej. "Transferencia el día 1 de cada mes"
}

export interface Resilience {
  emergencyFund: number;
  monthlyExpenses: number;
  targetMonths: number;
  incomeSources: { name: string; monthly: number }[];
  lastReview: string | null;
  reviewEveryDays: number;
}

export interface FamilyConversation {
  id: string;
  date: string;
  topic: string;
  with: string;
  notes?: string;
}

export interface LegacyPattern {
  id: string;
  inherited: string; // lo que heredé
  keep: string;      // lo que conservo
  change: string;    // lo que cambio
}

export interface AppState {
  userName: string;
  script: ScriptProfile | null;
  bandwidth: BandwidthCheck[];
  beliefs: BeliefEntry[];
  growth: GrowthExperiment[];
  identity: Identity;
  decisions: Decision[];
  opportunities: Opportunity[];
  microSteps: MicroStep[];
  habits: Habit[];
  resilience: Resilience;
  family: FamilyConversation[];
  legacyPatterns: LegacyPattern[];
}
