# Spec 09 — Completar traducciones i18n pendientes

**Estado:** Implementada
**Dependencias:** Ninguna (toca catálogos generados por specs anteriores, no introduce features nuevas)
**Fecha:** 2026-07-27

**Objetivo:** Completar los `msgstr` vacíos en los catálogos de lingui de los 7 locales no-español (`en`, `de`, `fr`, `it`, `ja`, `pt`, `zh`), cerrando tanto el gap antiguo de `en` (mySets/importación) como el gap reciente de los demás locales (flashcards/suscripción).

## Alcance

**Dentro de alcance:**
- Traducir los ~101 `msgstr` vacíos de `src/locales/en/messages.po` (mySets, importación PDF/Excel, contacto, plan Pro).
- Traducir los ~106 `msgstr` vacíos de cada uno de: `src/locales/de/messages.po`, `fr`, `it`, `ja`, `pt`, `zh` (flashcards, suscripción/billing, favoritos, welcome).
- Preservar exactamente placeholders (`{0}`, `{1}`, `{passPercent}`, etc.), sintaxis ICU plural (`{var, plural, one {...} other {...}}`) y tags inline (`<0>...</0>`) en cada traducción.
- Ejecutar `npm run i18n:compile` al final para regenerar catálogos compilados y detectar errores de sintaxis.
- Verificar que no queden `msgstr ""` en ninguno de los 7 catálogos no-`es` dentro de alcance.

**Fuera de alcance:**
- `es/messages.po` — se autogenera con `scripts/fill-es-po.js`, no se toca.
- Entradas obsoletas (`#~`) en cualquier catálogo — no se restauran ni se eliminan.
- Integración de un servicio de traducción externo (DeepL/API) — descartado, se traduce directamente.
- Revisión de calidad lingüística por hablantes nativos — queda como responsabilidad de revisión humana posterior a esta spec.
- `npm run i18n:extract` — no se re-extraen strings del código fuente, solo se llenan los `msgstr` ya extraídos y vacíos.

## Modelo de datos

No aplica — esta spec no introduce estructuras de datos nuevas, son ediciones de contenido en archivos `.po` existentes.

## Plan de implementación

1. Traducir `src/locales/en/messages.po`: completar los ~101 `msgstr` vacíos (mySets, importación PDF/Excel, contacto, plan Pro).
2. Traducir `src/locales/de/messages.po`: completar los ~106 `msgstr` vacíos (flashcards, suscripción, favoritos, welcome).
3. Traducir `src/locales/fr/messages.po`: mismo set de ~106 entradas.
4. Traducir `src/locales/it/messages.po`: mismo set de ~106 entradas.
5. Traducir `src/locales/pt/messages.po`: mismo set de ~106 entradas.
6. Traducir `src/locales/ja/messages.po`: mismo set de ~106 entradas, cuidando que la forma ICU `other` cubra todos los casos (japonés no flexiona plural).
7. Traducir `src/locales/zh/messages.po`: mismo set de ~106 entradas, mismo cuidado con plurales (chino tampoco flexiona).
8. Ejecutar `npm run i18n:compile` y confirmar que termina sin errores.
9. Verificación final: `grep -c 'msgstr ""'` en los 7 catálogos debe dar 0 (excluyendo entradas obsoletas `#~`).

## Criterios de aceptación

- [ ] `src/locales/en/messages.po` no contiene `msgstr ""` (excluyendo entradas obsoletas `#~`).
- [ ] `src/locales/de/messages.po` no contiene `msgstr ""` (excluyendo `#~`).
- [ ] `src/locales/fr/messages.po` no contiene `msgstr ""` (excluyendo `#~`).
- [ ] `src/locales/it/messages.po` no contiene `msgstr ""` (excluyendo `#~`).
- [ ] `src/locales/ja/messages.po` no contiene `msgstr ""` (excluyendo `#~`).
- [ ] `src/locales/pt/messages.po` no contiene `msgstr ""` (excluyendo `#~`).
- [ ] `src/locales/zh/messages.po` no contiene `msgstr ""` (excluyendo `#~`).
- [ ] Todos los placeholders (`{0}`, `{n}`, `{passPercent}`, etc.) y tags (`<0>...</0>`) se preservan idénticos entre `msgid` y `msgstr`.
- [ ] La sintaxis ICU plural (`{var, plural, one {...} other {...}}`) se preserva; solo se traduce el texto dentro de cada forma.
- [ ] `npm run i18n:compile` finaliza sin errores.
- [ ] `src/locales/es/messages.po` no se modifica.
- [ ] Ninguna entrada obsoleta (`#~`) se modifica, agrega o elimina.

## Decisiones tomadas y descartadas

- **Traducción manual por Claude, no servicio externo (DeepL/API).** Es trabajo de una sola vez sobre ~700 entradas; integrar un servicio nuevo añadiría una API key y configuración permanente para un uso puntual. Revisión humana post-spec cubre el control de calidad.
- **`es/messages.po` queda intacto.** Ya se gestiona automáticamente vía `scripts/fill-es-po.js` (es el locale fuente del contenido); tocarlo manualmente rompería ese flujo.
- **No se ejecuta `npm run i18n:extract`.** El gap de `msgstr` vacíos ya existe en los `.po` actuales; re-extraer podría traer cambios no relacionados si el código fuente cambió desde el último extract, ensuciando el diff de esta spec.
- **Entradas obsoletas (`#~`) no se tocan.** No fueron parte del pedido del usuario ("traducciones pendientes" se refiere a las activas); limpiarlas es un flujo de mantenimiento aparte.
- **Se cierran ambos gaps (viejo en `en`, nuevo en el resto) en una sola spec**, en vez de separarlos, porque ambos son el mismo tipo de trabajo (llenar `msgstr` vacíos) y no vale la pena el overhead de dos specs.

## Riesgos identificados

- **Placeholders o sintaxis ICU mal preservados rompen el compile o el render.** Ej. omitir `{0}` o alterar `one {...} other {...}` produce un catálogo inválido o un mensaje que no interpola valores. Mitigado por el paso de `npm run i18n:compile` al final de cada locale.
- **Matices de dominio imprecisos en la traducción automática.** Términos como "aprobar", "dominada", "mazo" tienen significado específico en el contexto de exámenes/flashcards que una traducción literal podría perder. Mitigado por revisión humana posterior (fuera de alcance de esta spec, pero señalado como paso siguiente recomendado).
- **`ja` y `zh` no flexionan plural.** Existe riesgo de traducir la forma `one` y `other` como si fueran gramaticalmente distintas cuando en esos idiomas el texto debe ser idéntico (o casi) en ambas formas. Mitigado explícitamente en el paso 6 y 7 del plan de implementación.
