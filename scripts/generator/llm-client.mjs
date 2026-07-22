/**
 * LLM client adapters — OpenAI, Google Gemini, Anthropic Claude.
 *
 * Cada adapter expone async generate(systemPrompt, userPrompt) -> string (JSON).
 * El selector autodetecta el provider en función de las env vars disponibles
 * o respeta la opcional LLM_PROVIDER.
 *
 * Modelos por defecto (overridables vía env):
 *   OpenAI    -> OPENAI_MODEL    (default: gpt-4o-mini)
 *   Gemini    -> GEMINI_MODEL    (default: gemini-2.0-flash)
 *   Anthropic -> ANTHROPIC_MODEL (default: claude-3-5-haiku-latest)
 */

const OPENAI_DEFAULT  = 'gpt-4o-mini';
const GEMINI_DEFAULT  = 'gemini-2.0-flash';
const CLAUDE_DEFAULT  = 'claude-3-5-haiku-latest';

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${body.slice(0, 500)}`);
  }
  return res.json();
}

// ─────────────────────────────────────────────
// OpenAI
// ─────────────────────────────────────────────
async function openaiGenerate({ apiKey, model, systemPrompt, userPrompt }) {
  const data = await fetchJson('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.6,
      max_tokens: 16000,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
    }),
  });
  return data.choices?.[0]?.message?.content ?? '';
}

// ─────────────────────────────────────────────
// Gemini (Google Generative Language API)
// ─────────────────────────────────────────────
async function geminiGenerate({ apiKey, model, systemPrompt, userPrompt }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;
  const data = await fetchJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.6,
        responseMimeType: 'application/json',
      },
    }),
  });
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

// ─────────────────────────────────────────────
// Anthropic Claude
// ─────────────────────────────────────────────
async function anthropicGenerate({ apiKey, model, systemPrompt, userPrompt }) {
  const data = await fetchJson('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 16_000,
      temperature: 0.6,
      system: systemPrompt + '\n\nResponde EXCLUSIVAMENTE con un objeto JSON válido. No incluyas ```json ni ningún texto fuera del JSON.',
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  return data.content?.[0]?.text ?? '';
}

// ─────────────────────────────────────────────
// Selector
// ─────────────────────────────────────────────
export function buildLLMClient(env = process.env) {
  let provider = (env.LLM_PROVIDER || '').toLowerCase().trim();

  if (!provider) {
    if (env.OPENAI_API_KEY)        provider = 'openai';
    else if (env.GEMINI_API_KEY)   provider = 'gemini';
    else if (env.ANTHROPIC_API_KEY) provider = 'anthropic';
    else throw new Error(
      'No LLM API key encontrada. Define alguna de: OPENAI_API_KEY, GEMINI_API_KEY, ANTHROPIC_API_KEY.\n' +
      'Opcionalmente puedes forzar el provider con LLM_PROVIDER=openai|gemini|anthropic.'
    );
  }

  if (provider === 'openai') {
    if (!env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY no definida.');
    const model = env.OPENAI_MODEL || OPENAI_DEFAULT;
    return {
      provider, model,
      generate: (systemPrompt, userPrompt) =>
        openaiGenerate({ apiKey: env.OPENAI_API_KEY, model, systemPrompt, userPrompt }),
    };
  }

  if (provider === 'gemini') {
    if (!env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY no definida.');
    const model = env.GEMINI_MODEL || GEMINI_DEFAULT;
    return {
      provider, model,
      generate: (systemPrompt, userPrompt) =>
        geminiGenerate({ apiKey: env.GEMINI_API_KEY, model, systemPrompt, userPrompt }),
    };
  }

  if (provider === 'anthropic') {
    if (!env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY no definida.');
    const model = env.ANTHROPIC_MODEL || CLAUDE_DEFAULT;
    return {
      provider, model,
      generate: (systemPrompt, userPrompt) =>
        anthropicGenerate({ apiKey: env.ANTHROPIC_API_KEY, model, systemPrompt, userPrompt }),
    };
  }

  throw new Error(`LLM_PROVIDER desconocido: "${provider}". Usa openai, gemini o anthropic.`);
}
