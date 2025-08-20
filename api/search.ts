// api/search.ts
import { DEFAULT_COUNTRY, DEFAULT_LANGUAGE, json, badRequest, getClient } from './_utils';

export default async function handler(req: any, res: any) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const q = url.searchParams.get('query') || '';
    if (!q.trim()) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }

    const country = url.searchParams.get('country') || DEFAULT_COUNTRY;
    const language = url.searchParams.get('language') || DEFAULT_LANGUAGE;

    const Client: any = await getClient();
    const jw = new Client({ country, language });

    // Adjust if library exposes different method names
    const results = await jw.search({ query: q });

    res.setHeader('content-type', 'application/json; charset=utf-8');
    return res.status(200).send(JSON.stringify({ query: q, country, language, results }, null, 2));
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal error', detail: String(err?.message || err) });
  }
}
