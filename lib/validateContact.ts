export type ContactInput = {
  name: string;
  email: string;
  message: string;
  website?: string;
  startedAt?: number;
};

/** Checks a contact-form submission. Returns an error message, 'spam' for bots, or null when valid. */
export function validateContact(body: unknown, now = Date.now()): string | null {
  if (!body || typeof body !== 'object') return 'Invalid request';
  const b = body as Record<string, unknown>;
  if (typeof b.name !== 'string' || typeof b.email !== 'string' || typeof b.message !== 'string')
    return 'Invalid request';
  // Honeypot: a hidden field real visitors never fill.
  if (typeof b.website === 'string' && b.website.trim() !== '') return 'spam';
  // Bots submit instantly; people take at least a few seconds.
  if (typeof b.startedAt === 'number' && now - b.startedAt < 3000) return 'spam';
  if (!b.name.trim() || !b.message.trim()) return 'Name and message are required';
  if (b.name.length > 80 || b.email.length > 120 || b.message.length > 2000) return 'Input too long';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) return 'Invalid email';
  if ((b.message.match(/https?:\/\//g) || []).length > 3) return 'Too many links in the message';
  return null;
}
