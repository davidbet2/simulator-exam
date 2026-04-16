# Research — Nuevo alcance del Panel de Administración

**Fecha:** 2026-04-16
**Tema:** Redefinir las capacidades del admin ahora que la creación de exámenes pasa al usuario final (feature `creator/`).
**Fuentes:** Estado actual del código + buenas prácticas de paneles admin SaaS (Firebase/Firestore).

---

## 1. Contexto — Qué cambió

Antes, el admin era el encargado de **crear el banco oficial de preguntas**. Ahora:

- Los usuarios tienen `creator/CreateExamPage` y publican sus propios `examSets` (subcolección `examSets/{id}/questions`).
- Existe un sistema de planes: `free` vs `pro` (ver `useAuthStore.js` + `PricingPage`).
- Existen ≥6 colecciones Firestore con datos reales: `questions`, `certifications`, `settings`, `admins`, `users`, `attempts`, `examSets`.
- El admin actual sólo cubre 3 de ellas (questions, admins, certifications) y no tiene visibilidad operativa (ni usuarios, ni intentos, ni sets de la comunidad, ni salud de la plataforma).

**Conclusión:** el admin deja de ser un *content creator* y pasa a ser un *platform operator*.

---

## 2. Responsabilidades nuevas del admin (priorizadas)

### 🔴 P0 — Indispensables (bloquean operación real)

| # | Capacidad | Por qué | Colección / fuente |
|---|-----------|---------|-------------------|
| 1 | **Gestión de usuarios** (listar, buscar, ver perfil, cambiar plan, banear) | Sin esto no se puede dar soporte, promover Pro manualmente, ni cerrar cuentas abusivas | `users/{uid}` |
| 2 | **Moderación de `examSets` de la comunidad** (ver, despublicar, borrar, marcar como destacado) | Contenido generado por usuarios = riesgo legal y de calidad. Hay que poder quitar algo indecente o con copyright. | `examSets/{id}` + subcolección |
| 3 | **Dashboard de métricas reales** (usuarios activos, intentos hoy/semana, sets publicados, conversión free→pro) | El actual sólo muestra "preguntas por cert", no habla de la salud del negocio | agregados de `users`, `attempts`, `examSets` |
| 4 | **Ver intentos (`attempts`) por usuario / set / cert** | Soporte ("¿por qué me aprobó/suspendió?"), detección de fraude, estadísticas reales | `attempts` |

### 🟡 P1 — Muy útiles a corto plazo

| # | Capacidad | Por qué |
|---|-----------|---------|
| 5 | **Promocionar examSets a "oficiales"** (copiar un examSet destacado al banco de `questions`) | Cerrar el loop creator → banco oficial sin tipear de nuevo |
| 6 | **Estadísticas por pregunta** (% aciertos, preguntas "rotas" con 0% o 100% de aciertos) | Detectar preguntas mal escritas o demasiado fáciles/difíciles |
| 7 | **Cambiar plan manualmente** (free ↔ pro, con log en `users.planChangedBy`) | Dar Pro promocional, cortesía a partners, compensaciones |
| 8 | **Feature flags globales** (activar/desactivar creador, importar XLSX/PDF, registro) | Apagar features en incidentes sin redeploy |
| 9 | **Logs de auditoría** (quién cambió qué: promociones de admin, borrados de sets, cambios de plan) | OWASP A09 — obligatorio si manejamos planes pagos |

### 🟢 P2 — Nice-to-have más adelante

| # | Capacidad | Por qué |
|---|-----------|---------|
| 10 | **Envío masivo de anuncios in-app / email** | Comunicar nuevas certs |
| 11 | **Exportar CSV** (usuarios, intentos, sets) para BI externo | Analítica offline |
| 12 | **Panel de reportes de usuarios** (usuarios reportan sets inapropiados) | Escala moderación |
| 13 | **Revisión de copys de la UI** (textos de planes, welcome) sin redeploy | Marketing iterativo |

---

## 3. Estructura de navegación recomendada

```
/admin                              → Dashboard (KPIs reales)
/admin/users                        → Usuarios (renombrar el actual a /admin/admins)
   ├── /admin/users/:uid           → Detalle usuario (plan, intentos, sets)
/admin/admins                       → (ex /admin/users) Grant/revoke admin
/admin/exam-sets                    → Moderación sets comunidad
   ├── /admin/exam-sets/:setId     → Preview + publicar/despublicar/promover
/admin/questions                    → Banco oficial (ya existe) + stats por pregunta
/admin/attempts                     → Explorador de intentos
/admin/certifications               → (ex /admin/settings)
/admin/settings                     → Feature flags + copys globales (NUEVO)
/admin/audit-log                    → Auditoría (NUEVO, P1)
```

Cambios de ruta necesarios:
- `/admin/users` (gestión admins) → **renombrar a `/admin/admins`**
- `/admin/settings` (certs) → **renombrar a `/admin/certifications`**
- Liberar `/admin/users` para el nuevo CRUD de usuarios reales
- Liberar `/admin/settings` para feature flags globales

---

## 4. Impacto en Firestore

### Reglas que hay que añadir
Los admins necesitan `read`/`write` sobre más colecciones. Hoy sólo tienen acceso a `questions`, `certifications`, `settings`, `admins` y lectura de `users`/`attempts`/`examSets` propios del usuario. Hay que añadir:

```
// users: admin puede update (cambiar plan)
match /users/{uid} {
  allow update: if request.auth != null
    && exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
}

// attempts: admin puede list/read todos
match /attempts/{id} {
  allow list, read: if request.auth != null
    && exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
}
```

Ya está cubierto para `examSets` (admin puede update/delete). OK.

### Colecciones nuevas
- `featureFlags/global` → documento único con `{ creatorEnabled, registrationEnabled, xlsxImportEnabled, ... }`. Lectura pública, escritura solo admin.
- `auditLog/{autoId}` → `{ actorEmail, action, target, targetId, diff, createdAt }`. Append-only, sólo admin lee; escribe cualquier acción admin (vía `useAudit()` hook).

---

## 5. Pitfalls y riesgos

| Riesgo | Mitigación |
|--------|-----------|
| ⚠️ Listar `users` / `attempts` completos puede ser caro en Firestore | Paginar (limit 25), buscar por `where('email', '==', ...)`, nunca `getDocs()` sin límite |
| ⚠️ Promover plan desde el admin puede ser auto-explotable | La regla `users.update` actualmente bloquea `plan` para el self. Añadir regla separada: admins sí pueden, con log obligatorio |
| ⚠️ Borrar un `examSet` deja intentos huérfanos | Mantenerlos (son datos del usuario), solo marcar set como `deleted: true` (soft-delete) |
| ⚠️ Exponer emails de usuarios en la UI admin = PII | No mostrar listado completo; requerir búsqueda explícita; nunca loguear emails en console |
| ⚠️ Bulk actions en la UI sin confirmación | Toda acción destructiva requiere modal de confirmación con nombre tecleado |

---

## 6. Librerías / patrones relevantes

- **Paginación cursor-based**: `query(collection, orderBy('createdAt', 'desc'), startAfter(last), limit(25))` — evita leer miles de docs.
- **Búsqueda por email exacto**: `where('email', '==', email)` con índice simple. Para búsqueda parcial hace falta Algolia / Typesense — por ahora dejamos email exacto.
- **Soft-delete pattern**: marcar `deleted: true` + `deletedAt`, filtrar en las queries públicas.
- **Feature flags**: un solo doc en Firestore, cacheado en memoria tras el primer fetch; el admin ve y edita booleans con Toggle.
- No instalar nuevas deps: todo esto se construye con Firebase SDK ya presente + Zustand + Tailwind.

---

## 7. Plan de implementación propuesto (fases)

**Fase 1 — Reestructuración + P0 usuarios (PR 1)**
- Renombrar rutas: `/admin/users` → `/admin/admins`, `/admin/settings` → `/admin/certifications`.
- Nueva `AdminUsersPage`: lista paginada, búsqueda por email, detalle con plan editable.
- Actualizar `firestore.rules` para admin write en `users` y list en `attempts`.
- Auditoría básica: cada cambio de plan escribe en `auditLog`.

**Fase 2 — P0 sets + dashboard (PR 2)**
- Nueva `AdminExamSetsPage`: lista sets publicados, preview, despublicar/soft-delete.
- Rediseñar `AdminDashboardPage`: KPIs (users totales, activos 7d, intentos 24h, sets publicados, conversión Pro %), cards con deltas.

**Fase 3 — P1 (PR 3+)**
- Stats por pregunta.
- Feature flags (`/admin/settings` nuevo).
- Audit log viewer.
- Promoción de examSet comunidad → banco oficial.

---

## 8. Preguntas abiertas para el usuario (antes de ejecutar)

1. **Orden de fases:** ¿Arrancamos Fase 1 (usuarios + reestructura de rutas) o prefieres empezar por el Dashboard rediseñado?
2. **Ruta `/admin/users`:** confirmar el rename (`/admin/users` → `/admin/admins`, el nuevo `/admin/users` = CRUD de usuarios reales). ¿OK?
3. **Soft-delete de `examSets`:** ¿vamos por soft-delete (recomendado) o hard-delete definitivo?
4. **Feature flags:** ¿esperamos a tener un caso real o los añadimos proactivamente en Fase 2?
5. **Audit log:** ¿obligatorio ya en Fase 1 o lo dejamos para P1?

---

## 9. Recomendación final

Empezar por **Fase 1** porque:
- Desbloquea soporte real a usuarios (cambiar plan, ver cuentas).
- Corrige la deuda de naming (`/admin/users` debería ser de usuarios, no de admins).
- Sienta las bases del audit log que vamos a necesitar sí o sí.
- Es autocontenida (1 PR atómico, ~3-4 commits).
