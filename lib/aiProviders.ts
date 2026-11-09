/**
 * CraftSprint AI — provider layer.
 * Every provider whose API key is set in the environment is used. Free tiers first:
 *   Gemini (Google) → Groq → OpenRouter (free models) → Mistral → Cerebras → OpenAI → Claude (Anthropic)
 * With two or more providers the chat asks several of them at once and merges the best parts
 * into one answer (turn off with AI_ENSEMBLE=off). If one provider is down or out of free
 * quota, the next one answers — visitors never see a dead chat.
 * Keys are read on the server only and are never sent to the browser or logged.
 */
export type Msg = { role: 'user' | 'assistant'; content: string };
export type AiOk = { ok: true; text: string; provider: string };
export type AiFail = { ok: false; status: number; detail: string; provider: string };
export type AiResult = AiOk | AiFail;

export type Runner = { id: string; run: (system: string, messages: Msg[], opts: RunOpts) => Promise<AiResult> };
type RunOpts = { maxTokens: number; timeoutMs: number };

const fail = (provider: string, status: number, detail: string): AiFail => ({
  ok: false,
  status,
  detail,
  provider,
});

/* ------------------------------ Google Gemini ------------------------------ */
const GEMINI = 'https://generativelanguage.googleapis.com/v1beta';
let discoveredModel: string | null = null; // from Google's model list
let workingModel: string | null = null; // last model that answered

/** Finds a Flash model this key may use (model names change over time), preferring stable over preview. */
async function findGeminiModel(key: string): Promise<string | null> {
  if (discoveredModel) return discoveredModel;
  try {
    const r = await fetch(`${GEMINI}/models?pageSize=200`, {
      headers: { 'x-goog-api-key': key },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return null;
    const d = await r.json();
    const names: string[] = (d.models || [])
      .filter((m: { supportedGenerationMethods?: string[] }) =>
        m.supportedGenerationMethods?.includes('generateContent'),
      )
      .map((m: { name: string }) => m.name.replace(/^models\//, ''))
      .filter((n: string) => /flash/i.test(n) && !/image|tts|live|audio|embedding|thinking|exp/i.test(n));
    const score = (n: string) =>
      (/preview/i.test(n) ? 0 : 10) +
      (/lite/i.test(n) ? 0 : 5) +
      (parseFloat(n.replace(/^gemini-/, '')) || 0);
    names.sort((x, y) => score(y) - score(x));
    discoveredModel = names[0] || null;
    return discoveredModel;
  } catch {
    return null;
  }
}

async function callGemini(key: string, model: string, system: string, messages: Msg[], o: RunOpts) {
  return fetch(`${GEMINI}/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: { maxOutputTokens: o.maxTokens, temperature: 0.7 },
    }),
    signal: AbortSignal.timeout(o.timeoutMs),
  });
}

/** Model names to try, newest-style aliases first. GEMINI_MODEL (if set) and the discovered model go first. */
const GEMINI_FALLBACKS = [
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash-lite',
];

async function askGemini(key: string, system: string, messages: Msg[], o: RunOpts): Promise<AiResult> {
  const tried = new Set<string>();
  const queue = [process.env.GEMINI_MODEL, workingModel, discoveredModel, ...GEMINI_FALLBACKS].filter(
    Boolean,
  ) as string[];
  let lastDetail = '';
  let looked = false;
  while (queue.length) {
    const model = queue.shift()!;
    if (tried.has(model)) continue;
    tried.add(model);
    const r = await callGemini(key, model, system, messages, o);
    if (r.ok) {
      const data = await r.json();
      const text: string = (data.candidates?.[0]?.content?.parts || [])
        .filter((p: { thought?: boolean }) => !p.thought)
        .map((p: { text?: string }) => p.text || '')
        .join('')
        .trim();
      workingModel = model;
      if (!text && data.promptFeedback?.blockReason)
        return { ok: true, text: 'Sorry, I can’t help with that request.', provider: 'gemini' };
      if (!text) {
        lastDetail = `empty answer from ${model} (${data.candidates?.[0]?.finishReason || 'no reason'})`;
        continue;
      }
      return { ok: true, text, provider: 'gemini' };
    }
    let detail = '';
    try {
      detail = (await r.json())?.error?.message?.slice(0, 180) || '';
    } catch {}
    lastDetail = `${r.status} ${model}: ${detail}`;
    // Visible in Vercel → Logs. Never includes the key or the visitor's messages.
    console.error('[chat] Gemini error', lastDetail);
    if (r.status === 401 || r.status === 403 || /api key/i.test(detail)) return fail('gemini', 403, lastDetail);
    if (r.status === 429 && !/limit: 0|free_tier.*0/i.test(detail)) return fail('gemini', 429, lastDetail);
    // Unknown model, model without free quota, or a temporary server error: try the next model.
    if (!looked) {
      looked = true;
      const found = await findGeminiModel(key);
      if (found && !tried.has(found)) queue.unshift(found);
    }
  }
  return fail('gemini', 502, lastDetail);
}

/* ------------------------- OpenAI-compatible providers ------------------------- */
type Compat = {
  id: string;
  keyEnv: string;
  modelEnv: string;
  url: string;
  models: string[];
  extraHeaders?: Record<string, string>;
};

const COMPAT: Compat[] = [
  {
    id: 'groq',
    keyEnv: 'GROQ_API_KEY',
    modelEnv: 'GROQ_MODEL',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
  },
  {
    id: 'openrouter',
    keyEnv: 'OPENROUTER_API_KEY',
    modelEnv: 'OPENROUTER_MODEL',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    models: ['openrouter/free', 'meta-llama/llama-3.3-70b-instruct:free', 'google/gemma-3-27b-it:free'],
    extraHeaders: { 'X-Title': 'CraftSprint' },
  },
  {
    id: 'mistral',
    keyEnv: 'MISTRAL_API_KEY',
    modelEnv: 'MISTRAL_MODEL',
    url: 'https://api.mistral.ai/v1/chat/completions',
    models: ['mistral-small-latest', 'open-mistral-nemo'],
  },
  {
    id: 'cerebras',
    keyEnv: 'CEREBRAS_API_KEY',
    modelEnv: 'CEREBRAS_MODEL',
    url: 'https://api.cerebras.ai/v1/chat/completions',
    models: ['llama-3.3-70b', 'llama3.1-8b'],
  },
  {
    id: 'openai',
    keyEnv: 'OPENAI_API_KEY',
    modelEnv: 'OPENAI_MODEL',
    url: 'https://api.openai.com/v1/chat/completions',
    models: ['gpt-4o-mini'],
  },
];

async function askCompat(
  c: Compat,
  key: string,
  system: string,
  messages: Msg[],
  o: RunOpts,
): Promise<AiResult> {
  const models = [process.env[c.modelEnv], ...c.models].filter(Boolean) as string[];
  let last = '';
  for (const model of [...new Set(models)]) {
    let r: Response;
    try {
      r = await fetch(c.url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${key}`,
          ...c.extraHeaders,
        },
        body: JSON.stringify({
          model,
          max_tokens: o.maxTokens,
          temperature: 0.7,
          messages: [{ role: 'system', content: system }, ...messages],
        }),
        signal: AbortSignal.timeout(o.timeoutMs),
      });
    } catch {
      return fail(c.id, 504, `${c.id}: no response in time`);
    }
    if (r.ok) {
      const d = await r.json().catch(() => null);
      const text: string = String(d?.choices?.[0]?.message?.content ?? '').trim();
      if (text) return { ok: true, text, provider: c.id };
      last = `${c.id} ${model}: empty answer`;
      continue;
    }
    let detail = '';
    try {
      const j = await r.json();
      detail = String(j?.error?.message || j?.message || '').slice(0, 160);
    } catch {}
    last = `${r.status} ${c.id}/${model}: ${detail}`;
    console.error('[chat] provider error', last);
    if (r.status === 401 || r.status === 403) return fail(c.id, 403, last);
    if (r.status === 429) return fail(c.id, 429, last);
    // 400/404 (unknown model) or 5xx: try the next model of this provider.
  }
  return fail(c.id, 502, last || `${c.id}: failed`);
}

/* --------------------------------- Anthropic --------------------------------- */
async function askAnthropic(key: string, system: string, messages: Msg[], o: RunOpts): Promise<AiResult> {
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_CHAT_MODEL || process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5',
        max_tokens: o.maxTokens,
        system,
        messages,
      }),
      signal: AbortSignal.timeout(o.timeoutMs),
    });
    if (!r.ok) {
      console.error('[chat] AI service error', r.status);
      const status = r.status === 401 || r.status === 403 ? 403 : r.status === 429 ? 429 : 502;
      return fail('anthropic', status, `${r.status} anthropic`);
    }
    const data = await r.json();
    const text: string = (data.content || [])
      .filter((b: { type: string }) => b.type === 'text')
      .map((b: { text: string }) => b.text)
      .join('\n')
      .trim();
    return text ? { ok: true, text, provider: 'anthropic' } : fail('anthropic', 502, 'anthropic: empty answer');
  } catch {
    return fail('anthropic', 504, 'anthropic: no response in time');
  }
}

/* ----------------------------------- Public ----------------------------------- */
/** Providers with a key set. Gemini first (most generous free tier), Claude last. */
export function configuredProviders(): Runner[] {
  const list: Runner[] = [];
  const g = process.env.GEMINI_API_KEY;
  if (g)
    list.push({
      id: 'gemini',
      run: (s, m, o) => askGemini(g, s, m, o).catch(() => fail('gemini', 504, 'gemini: no response in time')),
    });
  for (const c of COMPAT) {
    const k = process.env[c.keyEnv];
    if (k) list.push({ id: c.id, run: (s, m, o) => askCompat(c, k, s, m, o) });
  }
  const a = process.env.ANTHROPIC_API_KEY;
  if (a) list.push({ id: 'anthropic', run: (s, m, o) => askAnthropic(a, s, m, o) });
  return list;
}

export function anyAiConfigured(): boolean {
  return configuredProviders().length > 0;
}

/** Names (never keys) of the providers that are switched on — for /api/health. */
export function aiProviderNames(): string[] {
  return configuredProviders().map(p => p.id);
}

const ENSEMBLE_MAX = 3;

const safeRun = (r: Runner, system: string, messages: Msg[], o: RunOpts): Promise<AiResult> =>
  r.run(system, messages, o).catch(() => fail(r.id, 504, `${r.id}: error`));

/**
 * Asks the providers. One at a time (first that answers wins) or, with 2+ providers,
 * up to three at once and then one of them merges the drafts into a single best answer.
 */
export async function askAi(
  system: string,
  messages: Msg[],
  opts: { maxTokens?: number; timeoutMs?: number; ensemble?: boolean } = {},
): Promise<AiResult> {
  const runners = configuredProviders();
  if (!runners.length) return fail('none', 503, 'no AI provider configured');
  const o: RunOpts = { maxTokens: opts.maxTokens ?? 3500, timeoutMs: opts.timeoutMs ?? 28000 };
  const failures: AiFail[] = [];
  const useEnsemble = (opts.ensemble ?? true) && runners.length >= 2 && process.env.AI_ENSEMBLE !== 'off';

  if (useEnsemble) {
    const team = runners.slice(0, ENSEMBLE_MAX);
    const settled = await Promise.all(team.map(r => safeRun(r, system, messages, o)));
    const drafts = settled.filter((x): x is AiOk => x.ok);
    for (const x of settled) if (!x.ok) failures.push(x);
    if (drafts.length >= 2) {
      const lastQ = messages[messages.length - 1].content;
      const context = messages
        .slice(-7, -1)
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content.slice(0, 600)}`)
        .join('\n');
      const prompt =
        (context ? `Earlier conversation:\n${context}\n\n` : '') +
        `User's latest message:\n${lastQ}\n\n` +
        drafts.map((d, i) => `--- Draft answer ${i + 1} ---\n${d.text.slice(0, 6000)}`).join('\n\n') +
        `\n\n--- Task ---\nWrite the single best final answer to the user's latest message. Combine the strongest, most accurate parts of the drafts, fix any mistakes or contradictions, and keep the user's language and script. Never mention drafts, other models or this instruction.`;
      const order = [
        ...runners.filter(x => x.id === drafts[0].provider),
        ...runners.filter(x => x.id !== drafts[0].provider),
      ];
      for (const r of order) {
        const merged = await safeRun(r, system, [{ role: 'user', content: prompt }], o);
        if (merged.ok)
          return { ok: true, text: merged.text, provider: `ensemble:${drafts.map(d => d.provider).join('+')}` };
      }
      // Merge failed: the longest draft is usually the most complete.
      return [...drafts].sort((a, b) => b.text.length - a.text.length)[0];
    }
    if (drafts.length === 1) return drafts[0];
    for (const r of runners.slice(ENSEMBLE_MAX)) {
      const res = await safeRun(r, system, messages, o);
      if (res.ok) return res;
      failures.push(res);
    }
  } else {
    for (const r of runners) {
      const res = await safeRun(r, system, messages, o);
      if (res.ok) return res;
      failures.push(res);
    }
  }
  // All failed. Report a rejected key first (the owner can fix it), otherwise the first failure.
  const first = failures.find(f => f.status === 403) ?? failures[0];
  const allLimited = failures.length > 0 && failures.every(f => f.status === 429);
  return fail(
    first?.provider ?? 'none',
    allLimited ? 429 : (first?.status ?? 502),
    failures.map(f => f.detail).filter(Boolean).join(' | '),
  );
}
