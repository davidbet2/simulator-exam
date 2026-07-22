# Generador de exámenes con LLM

Genera ~80 exámenes con 50 preguntas originales cada uno (≈4,000 preguntas) llamando a una API de LLM. Soporta **OpenAI**, **Google Gemini** y **Anthropic Claude**. Solo eliges una.

## Setup (1 vez)

Añade UNA de estas variables a tu `.env` (ya en `.gitignore`):

```env
# Opción 1: OpenAI — recomendado por calidad/precio. Coste estimado total: ~$3-5 USD con gpt-4o-mini
OPENAI_API_KEY=sk-...

# Opción 2: Google Gemini — tier GRATUITO generoso (15 req/min, 1M tokens/día con gemini-2.0-flash)
GEMINI_API_KEY=...

# Opción 3: Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...
```

> Si solo defines una, el script la detecta automáticamente. Si defines varias, fuerza con `LLM_PROVIDER=gemini`.

## Uso

```powershell
# Genera TODO el catálogo (~80 exámenes, ~4000 preguntas)
node scripts/generator/generate-sets.mjs

# Genera solo un batch (recomendado para empezar y ver calidad)
node scripts/generator/generate-sets.mjs --batch sports

# Genera un solo examen (test rápido)
node scripts/generator/generate-sets.mjs --slug nasm-cpt-fundamentos

# Ajusta cantidad de preguntas (default 50)
node scripts/generator/generate-sets.mjs --batch sports --questions 30

# Más concurrencia si tu API lo permite (default 2)
node scripts/generator/generate-sets.mjs --concurrency 4

# Fuerza regeneración aunque exista cache
node scripts/generator/generate-sets.mjs --slug nasm-cpt-fundamentos --force
```

### Batches del catálogo

| Batch | Exámenes | Dominio |
|-------|---------:|---------|
| `sports`             | 10 | Fitness, deportes individuales y de equipo |
| `health-extended`    | 10 | BLS, ACLS, NCLEX, farmacología, ECG, pediatría |
| `business`           | 10 | GA4, Google Ads, Meta Blueprint, HubSpot, Salesforce, SEO, Email, PM |
| `cloud-extended`     | 8  | AWS DVA/SOA, Azure AZ-104/AZ-204, GCP CDL, Terraform, Network+ |
| `devops-programming` | 11 | Python PCEP/PCAP, JS, Java, Mongo, Postgres, DevOps, Ansible, Jenkins, Redis, Git |
| `english-extended`   | 10 | B2, C1, IELTS R/W, TOEFL, TOEIC, Business, Grammar, Vocab, Phonetics |
| `agile-extended`     | 8  | PSPO, SAFe SM, Kanban, PRINCE2, Six Sigma YB, CAPM, Design Thinking, Coaching |
| `security-extended`  | 8  | CEH, CISSP, Pentesting, Network/Cloud Security, IR, SOC, Cryptography |
| `logic-extended`     | 5  | Razonamiento matemático/verbal, pensamiento crítico, ICFES Saber Pro |
| **TOTAL**            | **80** | **80 exámenes × 50 preguntas = 4,000 preguntas** |

## Cómo funciona

1. **`exam-catalog.mjs`** — define metadata (slug, título, dominio, sub-temas) de cada examen.
2. **`llm-client.mjs`** — adapter unificado a OpenAI/Gemini/Anthropic con `responseMimeType: json`.
3. **`generate-sets.mjs`** — orquesta:
   - Llama al LLM con prompt sistema + prompt usuario por examen
   - Valida JSON: estructura, opciones A/B/C/D, exactly 1 correcta, explanation no vacía
   - Reintenta hasta 3 veces si falla
   - Cachea cada examen en `scripts/generator/.cache/<slug>.json` (reanudable)
   - Escribe `scripts/seed-data/sets-<batch>.mjs` agrupado por batch

4. **`seed-official-sets.mjs`** — autodetecta cualquier `sets-*.mjs` y sube todo a Firestore. **No hay que editarlo cuando aparecen nuevos batches.**

## Después de generar

```powershell
# Sube todo a Firestore (idempotente)
node scripts/seed-official-sets.mjs
```

## Recomendación de flujo

1. Empieza con un batch chico para validar calidad y coste real:
   ```powershell
   node scripts/generator/generate-sets.mjs --batch logic-extended --concurrency 2
   ```
2. Revisa 1-2 sets en `scripts/seed-data/sets-logic-extended.mjs`. Ajusta tu prompt en `generate-sets.mjs` si quieres cambiar tono/estilo.
3. Cuando estés conforme, lanza el resto:
   ```powershell
   node scripts/generator/generate-sets.mjs --concurrency 3
   ```
4. Sube a producción:
   ```powershell
   node scripts/seed-official-sets.mjs
   ```

## Costes estimados (50 preguntas × 80 exámenes)

| Provider | Modelo | Coste aprox |
|----------|--------|-------------|
| Gemini   | gemini-2.0-flash       | **$0** (free tier) |
| OpenAI   | gpt-4o-mini            | ~$3-5 USD |
| Anthropic | claude-3-5-haiku-latest | ~$5-8 USD |

> Free tier de Gemini: 15 req/min — usa `--concurrency 2` para no bloquear.

## Ampliar el catálogo

Para añadir más exámenes, solo edita `exam-catalog.mjs` y vuelve a correr el script. Lo que ya está cacheado no se regenera (a menos que pases `--force`).
