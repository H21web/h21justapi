// api/_utils.ts
export const DEFAULT_COUNTRY = 'US';
export const DEFAULT_LANGUAGE = 'en';

export function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
    ...init
  });
}

export function badRequest(message: string) {
  return json({ error: message }, { status: 400 });
}

export async function getClient() {
  // ESM-only lib: dynamic import ensures compatibility in Vercel serverless
  const mod = await import('justwatch-api-client');
  return (mod as any).default ?? mod;
}
