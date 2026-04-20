# ADR-002: Expansión Multi-Plataforma — CertZen ya no es solo IT/Appian

**Fecha:** 2026-04-19  
**Estado:** ACTIVO  
**Prioridad:** MÁXIMA — aplica a TODOS los archivos, agentes, SEO y copy

---

## Contexto

CertZen nació como simulador de certificaciones Appian (IT). A partir de esta decisión, la plataforma se expande para soportar **cualquier categoría de certificación profesional**:

- **IT:** Appian, AWS, Salesforce, Azure, Google Cloud, CompTIA, etc.
- **Deportes:** NASM, ACE, NSCA, árbitros, coaching
- **Salud:** Enfermería, farmacología, primeros auxilios, nutrición clínica
- **Inglés:** IELTS, TOEFL, Cambridge B2/C1, TOEIC
- **Negocios/Otros:** PMP, Scrum, ITIL, finanzas, derecho laboral

---

## Decisión

1. **Appian NO es la identidad del producto** — es UN ejemplo dentro de la categoría IT.
2. **Ningún archivo, agente, skill o copy debe hacer referencia EXPLÍCITA a Appian como identidad core.** Appian puede mencionarse como ejemplo: "IT (ej. Appian, AWS...)".
3. **SEO y marketing** deben seguir el patrón multi-plataforma: una landing por certificación, pattern replicable.
4. **Nombre clave del modo Testlet:** `Caso Estudio` (antes: `Caso Appian`).
5. **Tagline oficial:** "El simulador de certificaciones con UX moderna, explicaciones claras y precio justo — para IT, Deportes, Salud, Inglés y más."

---

## Archivos actualizados en esta sesión

| Archivo | Cambio |
|---------|--------|
| `CLAUDE.md` | Resumen multi-plataforma, fecha actualizada |
| `src/CLAUDE.md` | Nombre de módulo: CertZen Multi-Plataforma |
| `docs/architecture.md` | Propósito: multi-categoría, Appian como ejemplo |
| `.github/agents/marketing-growth.agent.md` | Reescrito: multi-plataforma, Appian como ejemplo IT |
| `.github/agents/search-console-expert.agent.md` | Meta tags genéricos por certificación |
| `.github/agents/competitive-analyst.agent.md` | Descripción multi-plataforma |
| `.github/skills/google-search-console/SKILL.md` | Fórmula de títulos genérica |
| `memory/research/2026-04-16-novel-study-formats.md` | `Caso Appian` → `Caso Estudio` |

---

## Consecuencias

- Todos los agentes deben adaptar sus ejemplos para ser multi-plataforma.
- Al crear nuevas landing pages, SEO content o copy: usar el patrón `/[categoria]/[certificacion]`.
- Los research reports históricos con "Appian" en su contenido son válidos — documentan análisis competitivo real. No borrar.
- El banco de preguntas de Appian existente es válido — es el primer contenido de la categoría IT.

---

## Anti-Patrones a Evitar

- ❌ "El simulador de Appian" — en su lugar: "el simulador de certificaciones profesionales"
- ❌ Crear landing pages solo para Appian — usar el patrón multi-categoría
- ❌ Copy que asuma el usuario es developer IT — puede ser trainer, enfermero o estudiante de inglés
