---
name: firebase
description: >
  Firebase platform expert for SimulatorExam. Deep knowledge of Auth (Google OAuth),
  Firestore (security rules, indexes, queries, cost), Firebase Hosting (deploy, CSP, headers),
  and Firebase CLI. Use when asked about "firebase", "firestore", "rules", "auth",
  "deploy", "hosting", "indexes", "permisos", "CSP", "costos firebase", or debugging
  any Firebase error.
argument-hint: "<task: debug rules | design data model | optimize query cost | fix deploy | audit security>"
allowed-tools: Read Write Grep Glob fetch WebSearch terminal
---

# Skill: Firebase Expert

## Cuándo se Activa
- "error de permisos Firestore" / "Missing or insufficient permissions"
- "reglas de seguridad" / "firestore.rules"
- "índice Firestore" / "composite index" / "failed-precondition"
- "deploy firebase" / "firebase hosting"
- "CSP error" / "Content-Security-Policy"
- "costos firebase" / "lecturas Firestore"
- "autenticación" / "Google OAuth" / "signInWithPopup"
- "rules playground" / "Firebase emulator"
- "plan de datos" / "schema Firestore"

---

## Flujo de Trabajo

```
FASE 1: CONTEXTO
  → Leer src/core/firebase/firebase.js (config)
  → Leer firestore.rules
  → Leer firestore.indexes.json
  → Leer firebase.json (hosting config, CSP headers)
  → Identificar colecciones relevantes en src/

FASE 2: DIAGNÓSTICO
  → Reproducir el error con el mensaje exacto
  → Clasificar: Rules | Index | Auth | Hosting | Cost

FASE 3: IMPLEMENTACIÓN
  → Proponer cambio mínimo y quirúrgico
  → Para Rules: siempre mostrar el cambio antes de aplicar
  → Para indexes: actualizar firestore.indexes.json
  → Para CSP: actualizar el header en firebase.json

FASE 4: DEPLOY & VERIFICACIÓN
  → firebase deploy --only firestore:rules (rules)
  → firebase deploy --only firestore:indexes (indexes)
  → firebase deploy --only hosting (hosting/CSP)
  → Verificar en Firebase Console que no hay errores
```

---

## Colecciones del Proyecto

```
users/{uid}
  ├── displayName, email, plan (free|pro), createdAt, photoURL
  ├── /questionStats/{setId_qId} → box, dueAt, rightCount, wrongCount, lastResult
  └── /favorites/{setId}         → timestamp

examSets/{slug}
  ├── title, description, domain, published, official, questionCount
  └── /questions/{qid}           → text, options, correctIndex, explanation, domain

attempts/{attemptId}
  ├── uid, certId, certTitle, score, total, passPercent
  ├── answers: [{questionId, selectedIndex, correct}]
  └── createdAt (Timestamp)

admins/{email}             → valor: true
featureFlags/global        → flags por feature name
```

---

## Patrones de Queries Seguros

```js
// ✅ Query con índice compuesto (uid + createdAt — YA DESPLEGADO)
query(collection(db, 'attempts'),
  where('uid', '==', user.uid),
  orderBy('createdAt', 'desc'),
  limit(20)
)

// ✅ Aggregate query (costo: 1 lectura independiente del count)
const snap = await getCountFromServer(q)
const count = snap.data().count

// ✅ Subcollección sin índice compuesto (mismo documento)
getDocs(collection(db, 'users', uid, 'questionStats'))

// ⚠️ Evitar — escanea toda la colección
getDocs(collection(db, 'examSets'))  // OK si < 100 docs, cuidado en escala
```

---

## Error Handling por Código de Error

```js
// Mapa de códigos Firebase → acción recomendada
const FIREBASE_ERRORS = {
  'permission-denied':      'Reglas Firestore deniegan el acceso — revisar firestore.rules',
  'failed-precondition':    'Índice en construcción — manejar con console.info, no error',
  'not-found':              'Documento no existe — verificar lógica de creación',
  'unavailable':            'Firestore temporalmente no disponible — retry automático del SDK',
  'unauthenticated':        'Usuario no autenticado — verificar onAuthStateChanged',
  'resource-exhausted':     'Cuota excedida — revisar costos y rate limits',
  'cancelled':              'Listener cancelado — normal al desmontar componente',
}
```

---

## Reglas de Seguridad: Patrones Seguros

```javascript
// ✅ SIEMPRE verificar uid propio para datos personales
allow read: if request.auth.uid == resource.data.uid;

// ✅ SIEMPRE verificar uid en escritura (previene spoofing)
allow create: if request.auth != null
              && request.resource.data.uid == request.auth.uid;

// ✅ Datos inmutables (attempts no se editan)
allow update, delete: if false;

// ✅ Validar campos al crear
allow create: if request.resource.data.keys().hasOnly(['uid', 'score', 'total', 'certId', 'createdAt'])
              && request.resource.data.score is int
              && request.resource.data.score >= 0;

// ⚠️ NUNCA usar esto en producción:
allow read, write: if true;  // ← abre todo al público
```

---

## firebase.json: Estructura Óptima

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "headers": [
      {
        "source": "/static/**",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
      },
      {
        "source": "/**",
        "headers": [
          { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
        ]
      }
    ]
  }
}
```

---

## Deploy Workflow

```bash
# Build
npm run build

# Deploy todo
firebase deploy

# Deploy solo lo que cambió
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes

# Preview antes de deploy (hosting)
firebase hosting:channel:deploy preview-branch --expires 1d
# URL temporal: https://simulatorexam-dec4b--preview-branch-XXXX.web.app

# Emulador local (sin tocar producción)
firebase emulators:start --only firestore,auth
```

---

## Checklist de Seguridad Firebase

- [ ] firestore.rules: `allow read, write: if true` NO existe
- [ ] Cada colección tiene reglas explícitas
- [ ] Escrituras verifican `request.auth.uid == request.resource.data.uid`
- [ ] Attempts son inmutables (`allow update, delete: if false`)
- [ ] Admin check usa colección `admins/` (no campo en user)
- [ ] API keys en `.env` con prefijo `VITE_`, no en el código
- [ ] CSP en firebase.json no usa `unsafe-eval` innecesario
- [ ] Billing alert configurada en GCP Console

---

## Documentación Oficial
- Auth Web: https://firebase.google.com/docs/auth/web/google-signin
- Firestore Rules: https://firebase.google.com/docs/firestore/security/rules-structure
- Firestore Indexes: https://firebase.google.com/docs/firestore/query-data/indexing
- Firestore Queries: https://firebase.google.com/docs/firestore/query-data/queries
- Firebase Hosting: https://firebase.google.com/docs/hosting
- Firebase CLI: https://firebase.google.com/docs/cli
- Emulator Suite: https://firebase.google.com/docs/emulator-suite
