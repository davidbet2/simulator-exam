# Arquitectura del Sistema

> Documento vivo — actualizar cuando cambien decisiones arquitectónicas significativas.
> Para cambios menores, actualizar solo la sección relevante. Para cambios mayores, crear un ADR.

---

## Visión General

**Propósito del sistema:** Simulador de exámenes de certificación Appian. Permite a candidatos practicar en condiciones reales (temporizador, navegación entre preguntas, modo estudio vs. examen) con un banco de preguntas administrado vía panel interno.

**Principios arquitectónicos que guían este sistema:**

1. **Separación de preocupaciones** — La lógica de negocio no conoce la infraestructura
2. **Fail fast** — Detectar errores lo antes posible, siempre en los límites del sistema
3. **Explicitud sobre magia** — Código predecible sobre convención implícita
4. **Evolución incremental** — Diseñar para cambiar, no para la perfección inicial

---

## Diagrama de Contexto

```
[Usuario]                   [Admin]
    │                          │
    ▼                          ▼
React SPA (Vite)          React SPA (Vite)
    │                    Admin routes
    │                          │
    └────┉────────────────┘
              │
     ┌───────┴────────┐
     │   Firebase          │
     │  ┌───────────┐    │
     └─►│  Auth         │    │
         │  Firestore    │◄─┘
         │  Hosting      │
         └───────────┘
```

No existe servidor backend propio. Toda la lógica de servidor es manejada por Firebase BaaS.

---

## Módulos Principales

### `src/core/` — Infraestructura Compartida
**Responsabilidad:** Configuración global, routing, estado y constantes de dominio

- `constants/certifications.js` — Definición de todos los tipos de exámen (id, tiempo, pass%)
- `firebase/firebase.js` — Único punto de inicialización de Auth y Firestore
- `router/` — AppRouter + ProtectedRoute (redirige a login si no autenticado)
- `store/useAuthStore.js` — Estado global de autenticación (Zustand)

---

### `src/features/exam/` — Motor de Examen
**Responsabilidad:** Flujo completo del examen: carga de preguntas, temporizador, navegación, envío

- `useExam.js` — Hook principal: carga preguntas de Firestore, maneja respuestas/flags/timer
- `ExamPage.jsx` — UI del examen con `QuestionNavigator` + `QuestionCard` + `TimerBox`
- `QuestionCard.jsx` — Renderiza una pregunta (single/multi/matching/ordering)
- `TimerBox.jsx` — Temporizador regresivo, cambia color al 20% restante

**Tipos de pregunta soportados:** `single`, `multiple`, `matching`, `ordering`

---

### `src/features/welcome/` — Selección de Examen
**Responsabilidad:** Landing page post-login, muestra las certificaciones disponibles

- `WelcomePage.jsx` — Grid de cards por certificación (consulta Firestore para count de preguntas)
- Certificaciones con `available: false` se muestran como "Próximamente"

---

### `src/features/results/` — Resultados
**Responsabilidad:** Mostrar score final, respuestas correctas/incorrectas, resultado aprobado/reprobado

- `ResultsPage.jsx` — Recibe estado vía router (score, preguntas, respuestas del usuario)

---

### `src/features/admin/` — Panel de Administración
**Responsabilidad:** CRUD de preguntas e importación masiva. Solo accesible para admins.

- `AdminDashboardPage.jsx` — Vista general
- `AdminQuestionsPage.jsx` — Lista y edición de preguntas por certificación
- `ImportModal.jsx` — Importación de preguntas desde JSON
- `QuestionForm.jsx` — Formulario de creación/edición de pregunta

---

## Modelo de Datos (Firestore)

```
Collections:
  questions/{certId}/items/{questionId}
    ├── text: string
    ├── type: 'single' | 'multiple' | 'matching' | 'ordering'
    ├── options: string[]
    ├── correct: number[] | string[]
    └── explanation?: string
```

---

## Flujo de Autenticación

```
Usuario ─► WelcomePage
    │  (no auth)
    ▼
ProtectedRoute ─► AdminLoginPage (Firebase signInWithEmailAndPassword)
    │  (auth ok)
    ▼
WelcomePage ─► [selecciona certificación] ─► ExamPage ─► ResultsPage
```

---

## Decisiones Técnicas Clave

> Ver historial detallado en [docs/decisions/](decisions/)

| Área               | Decisión                     | Razón                                      |
|--------------------|------------------------------|--------------------------------------------|
| Backend            | Firebase BaaS                | Sin servidor propio — auth + DB incluidos  |
| Estado global      | Zustand                      | Solo auth state — Redux es overkill        |
| Routing            | React Router v7              | Estándar de facto en React SPAs            |
| Build              | Vite 5                       | Dev server instantáneo, HMR rápido         |
| Estilos            | Tailwind CSS 3               | Utility-first, sin CSS files separados     |
| Estructura         | Feature-based (`features/`)  | Escalabilidad por dominio/certificación    |

---

## Flujos Principales

### Flujo de Request típico

```
1. Request HTTP llega a src/api/
2. Autenticación en middleware
3. Validación del schema de entrada
4. Traducción a Command/Query del dominio
5. Ejecución en src/core/
6. Persistencia via interface (no implementación concreta)
7. Serialización de respuesta
8. Response HTTP
```

---

## Características No Funcionales

| Atributo         | Objetivo                    | Estado    |
|------------------|-----------------------------|-----------|
| Latencia P99     | < [X]ms                     | Por medir |
| Disponibilidad   | [X]% uptime                 | Por medir |
| Throughput       | [X] req/s                   | Por medir |

---

## Seguridad

- **Autenticación:** [mecanismo — JWT, session, API Key]
- **Autorización:** [modelo — RBAC, ABAC, etc.]
- **Secrets:** Variables de entorno únicamente, nunca en código
- **Inputs:** Validados y sanitizados siempre en el boundary de la API
- **Comunicaciones:** [TLS/HTTPS en tránsito]
- **Datos en reposo:** [mecanismo de cifrado si aplica]

---

## Estrategia de Testing

```
Unit tests    → src/core/ (lógica pura, sin I/O)
Integration   → src/api/ + adapters (con DB/servicios reales o testcontainers)  
E2E           → Flujos críticos del negocio completos
```

---

## Historial de Cambios Arquitectónicos

| Versión | Cambio | ADR |
|---------|--------|-----|
| 0.0.0   | Setup inicial | — |
