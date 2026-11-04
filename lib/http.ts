/** Small helpers for API routes: safe JSON reading with a size limit and a JSON content type. */
export class BodyError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Reads a JSON body, rejecting wrong content types, bodies over `maxBytes` and malformed JSON. */
export async function readJsonBody(req: Request, maxBytes: number): Promise<unknown> {
  const type = req.headers.get('content-type') || '';
  if (!type.toLowerCase().includes('application/json')) throw new BodyError(415, 'Please send JSON.');
  const declared = Number(req.headers.get('content-length') || 0);
  if (declared > maxBytes) throw new BodyError(413, 'Request is too large.');
  const text = await req.text();
  if (new TextEncoder().encode(text).length > maxBytes) throw new BodyError(413, 'Request is too large.');
  try {
    return JSON.parse(text);
  } catch {
    throw new BodyError(400, 'Invalid request.');
  }
}
