# MindWealth · Mente de Millón

Entrenador personal de psicología y estrategia financiera basado en el libro
**«Tu Mente Vale Más Que Un Millón»**. Diseño *calm tech*: azul noche `#0F172A`,
verde esmeralda `#10B981` y acentos dorados `#F59E0B`.

## Arrancar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm run typecheck && npm run lint
```

Stack: Next.js 14 (App Router) · TypeScript · Tailwind CSS · Recharts · lucide-react.
Privacidad: todos los datos se guardan **solo en el dispositivo** (`localStorage`, clave `mindwealth:v1`).
Hasta que el usuario introduce sus datos, el Dashboard muestra datos de ejemplo.

## Estructura

```
src/
├── app/
│   ├── layout.tsx              # Shell global (sidebar escritorio + barra inferior móvil)
│   ├── page.tsx                # Dashboard principal
│   ├── modulos/                # Índice de todos los módulos (móvil)
│   ├── guiones/                # M1  Diagnóstico de Guiones del Dinero (Klontz)
│   ├── ancho-de-banda/         # M2  Monitor de Ancho de Banda Cognitivo
│   ├── creencias/              # M3  Reestructurador de Creencias / Creencias Puente
│   ├── crecimiento/            # M4  Gimnasio de Mentalidad de Crecimiento (Dweck)
│   ├── identidad/              # M5  Constructor de Identidad y Votos
│   ├── decisiones/             # M6  Matriz de Decisiones en 4 Preguntas
│   ├── oportunidades/          # M7  Escáner de Oportunidades
│   ├── accion-48h/             # M8  Ejecutor de Acción en 48 h
│   ├── habitos/                # M9  Sistemas y «Nunca Fallar Dos Veces»
│   ├── resiliencia/            # M10 Escudo de Resiliencia en 3 Pilares
│   └── legado/                 # M11 Legado y Conversaciones Familiares
├── components/
│   ├── layout/                 # AppShell, Sidebar, BottomNav
│   ├── dashboard/              # Dashboard y sus widgets (uno por módulo)
│   ├── modules/                # ModulePage: plantilla común de cada módulo
│   └── ui/                     # Card, Badge, Progress (estilo shadcn)
└── lib/
    ├── modules.ts              # Registro de los 11 módulos (nav + grid)
    ├── types.ts                # Modelo de datos completo (AppState)
    ├── storage.ts              # Almacén local con useSyncExternalStore
    ├── insights.ts             # Cálculos: índice global, ancho de banda, rachas, resiliencia…
    ├── demo-data.ts            # Estado vacío y datos de ejemplo
    └── utils.ts
```

## Dashboard: cómo conecta los módulos

| Widget | Módulo(s) | Qué muestra |
|---|---|---|
| Índice «Mente de Millón» | 2, 5, 9, 10 | Puntuación 0–100 en 4 pilares + **siguiente mejor acción** (una sola, para no saturar) |
| Ancho de banda | 2 | Puntuación de hoy, tendencia de 7 días, aviso de visión de túnel |
| Guiones del dinero | 1 | Radar Evasión/Adoración/Estado/Vigilancia y consejo de calibración |
| Identidad económica | 5 | Identidad elegida, votos por día y registro rápido de un voto |
| Sistemas y hábitos | 9 | Marcar hábitos de hoy, rachas, alerta «nunca fallar dos veces» |
| Acción en 48 h | 8 | Micro-pasos con cuenta atrás |
| Decisiones abiertas | 6 | Certeza vs. umbral del 70%, reversibilidad, coste de indecisión |
| Escudo de resiliencia | 10 | Fondo de tranquilidad, diversificación, próxima revisión |
| Reprogramación en curso | 3, 4, 7, 11 | Última creencia puente, experimento, oportunidad y conversación familiar |

Las páginas de módulo ya existen con su lista de herramientas; el siguiente paso es
construir cada herramienta interactiva dentro de `src/app/<modulo>/page.tsx`
usando `useAppState()` y los tipos de `src/lib/types.ts`.
