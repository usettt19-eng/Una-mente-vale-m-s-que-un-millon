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
│   ├── modules/
│   │   ├── ModulePage.tsx      # Cabecera común de cada módulo
│   │   └── tools/              # Herramienta interactiva de cada módulo (11 archivos)
│   └── ui/                     # Card, Badge, Progress, formularios (estilo shadcn)
└── lib/
    ├── modules.ts              # Registro de los 11 módulos (nav + grid)
    ├── types.ts                # Modelo de datos completo (AppState)
    ├── storage.ts              # Almacén local con useSyncExternalStore
    ├── insights.ts             # Cálculos: índice global, ancho de banda, rachas, resiliencia…
    ├── demo-data.ts            # Estado vacío y datos de ejemplo
    ├── content/                # Contenido: preguntas del test, reglas de creencias,
    │                           # veredictos de decisiones, guías familiares
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

## Qué hace cada módulo

| # | Módulo | Herramientas |
|---|---|---|
| 1 | Guiones del dinero | Test de 12 preguntas (1–5), radar, significado y riesgo, origen familiar, plan de calibración que se envía al Módulo 8 |
| 2 | Ancho de banda | Test de 30 s (sueño, estrés, preocupación, bucles abiertos), estado (despejada / moderada / túnel), consejos, aviso si hay decisión importante, histórico |
| 3 | Creencias | Diario; detector de absolutismos y escasez; propuestas de Creencia Puente editables; checklist de credibilidad |
| 4 | Crecimiento | Conversor «el poder del aún»; registro de errores como experimentos con coste de la lección y próximo experimento |
| 5 | Identidad | Identidad elegida, votos con ideas rápidas, racha, mapa de 28 días, historial |
| 6 | Decisiones | Asistente de 4 preguntas, certeza con umbral del 70%, costo de oportunidad y de indecisión, fecha límite, veredicto (tiene en cuenta el ancho de banda de hoy), cierre de decisiones |
| 7 | Oportunidades | Queja → necesidad, dolor × alcance, mapa en 4 cuadrantes, «Validar en 48 h» |
| 8 | Acción 48 h | Descomponedor con test del micro-paso, cuenta atrás de 48 h, arranque de 5 minutos, «hazlo más pequeño» |
| 9 | Hábitos | Sistemas manuales o automatizados, versión mínima, rejilla de 14 días, rachas, alerta «nunca fallar dos veces» |
| 10 | Resiliencia | Fondo (meses cubiertos), fuentes de ingreso con gráfico y dependencia, frecuencia y checklist de revisión |
| 11 | Legado | Disparadores por persona (pareja, hijos, padres…), reglas, registro de conversaciones, patrones heredado/conservo/cambio, lecciones por edad |

Los recordatorios del Módulo 8 son, por ahora, dentro de la app (Dashboard y «Siguiente paso»); no hay notificaciones push.
