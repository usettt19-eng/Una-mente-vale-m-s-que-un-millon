import {
  Brain, Gauge, RefreshCcw, Sprout, Fingerprint, Scale, Radar,
  Timer, Repeat, Shield, Users, type LucideIcon,
} from "lucide-react";

export type ModuleGroup = "mente" | "decision" | "accion" | "patrimonio";

export interface AppModule {
  id: number;
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  group: ModuleGroup;
  concept: string;
}

export const MODULE_GROUPS: Record<ModuleGroup, string> = {
  mente: "Sistema operativo mental",
  decision: "Decisiones y oportunidades",
  accion: "Acción y hábitos",
  patrimonio: "Patrimonio y legado",
};

export const MODULES: AppModule[] = [
  { id: 1, slug: "guiones", title: "Diagnóstico de Guiones del Dinero", short: "Guiones",
    description: "Mapea tu perfil automático: Evasión, Adoración, Estado o Vigilancia.",
    icon: Brain, group: "mente", concept: "Money Scripts (Klontz)" },
  { id: 2, slug: "ancho-de-banda", title: "Monitor de Ancho de Banda", short: "Ancho de banda",
    description: "Detecta visión de túnel y fatiga por escasez antes de decidir.",
    icon: Gauge, group: "mente", concept: "Escasez y carga cognitiva" },
  { id: 3, slug: "creencias", title: "Reestructurador de Creencias", short: "Creencias",
    description: "Convierte pensamientos de escasez en Creencias Puente realistas.",
    icon: RefreshCcw, group: "mente", concept: "Creencias Puente" },
  { id: 4, slug: "crecimiento", title: "Gimnasio de Mentalidad de Crecimiento", short: "Crecimiento",
    description: "Registra errores como experimentos y añade el poder del «aún».",
    icon: Sprout, group: "mente", concept: "Growth mindset (Dweck)" },
  { id: 5, slug: "identidad", title: "Constructor de Identidad Económica", short: "Identidad",
    description: "Elige quién quieres ser y vota por esa identidad cada día.",
    icon: Fingerprint, group: "mente", concept: "Votos de evidencia" },
  { id: 6, slug: "decisiones", title: "Matriz de Decisiones en 4 Preguntas", short: "Decisiones",
    description: "Reversible vs. irreversible, peor escenario y regla del 70%.",
    icon: Scale, group: "decision", concept: "Decisión racional" },
  { id: 7, slug: "oportunidades", title: "Escáner de Oportunidades", short: "Oportunidades",
    description: "Convierte quejas y fricciones en necesidades de mercado.",
    icon: Radar, group: "decision", concept: "Quejas → necesidades" },
  { id: 8, slug: "accion-48h", title: "Ejecutor de Acción en 48 h", short: "Acción 48 h",
    description: "Descompón metas en el micro-paso más pequeño y empieza ya.",
    icon: Timer, group: "accion", concept: "Efecto Zeigarnik" },
  { id: 9, slug: "habitos", title: "Sistemas y «Nunca Fallar Dos Veces»", short: "Hábitos",
    description: "Automatiza rutinas y reajusta en menos de 24 h si fallas.",
    icon: Repeat, group: "accion", concept: "Sistemas > metas" },
  { id: 10, slug: "resiliencia", title: "Escudo de Resiliencia en 3 Pilares", short: "Resiliencia",
    description: "Fondo de tranquilidad, diversificación de ingresos y revisiones.",
    icon: Shield, group: "patrimonio", concept: "Resiliencia financiera" },
  { id: 11, slug: "legado", title: "Legado y Conversaciones Familiares", short: "Legado",
    description: "Habla de dinero en familia y rompe patrones intergeneracionales.",
    icon: Users, group: "patrimonio", concept: "Legado" },
];

export const getModule = (slug: string) => MODULES.find((m) => m.slug === slug);
