/**
 * Rate limiter for API routes.
 * - With UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN set (free tier at upstash.com),
 *   limits are shared across every Vercel instance.
 * - Without them it falls back to per-instance memory, which still stops simple floods.
 */
const memory = new Map<string, number[]>();

function memoryLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const list = (memory.get(key) || []).filter(t => now - t < windowMs);
  list.push(now);
  memory.set(key, list);
  if (memory.size > 5000) {
    for (const [k, v] of memory) {
      if (!v.some(t => now - t < windowMs)) memory.delete(k);
    }
  }
  return list.length > limit;
}

let warned = false;
/** 'shared' when Upstash Redis is configured (limits hold across all servers), otherwise 'memory'. */
export function rateLimitMode(): 'shared' | 'memory' {
  return process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN ? 'shared' : 'memory';
}

export async function isRateLimited(
  scope: string,
  ip: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const key = `rl:${scope}:${ip}`;
  const url = process.env.UPSTASH_REDIS_REST_URL,
    token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      const r = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify([
          ['INCR', key],
          ['PEXPIRE', key, String(windowMs), 'NX'],
        ]),
        signal: AbortSignal.timeout(3000),
      });
      if (r.ok) {
        const data = (await r.json()) as { result: number }[];
        return Number(data?.[0]?.result) > limit;
      }
    } catch {
      /* fall back to memory */
    }
  }
  if (!warned && process.env.NODE_ENV === 'production' && rateLimitMode() === 'memory') {
    warned = true;
    console.warn('[rate-limit] Upstash Redis is not configured — limits are per server instance only.');
  }
  return memoryLimited(key, limit, windowMs);
}

export function clientIp(req: Request) {
  return req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
}
