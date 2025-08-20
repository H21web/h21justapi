// api/title/[id].ts
import { DEFAULT_COUNTRY, DEFAULT_LANGUAGE, getClient } from '../../_utils';

export default async function handler(req: any, res: any) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Vercel passes the param in req.query for @vercel/node
    const idStr = (req.query?.id ?? '').toString();
    const id = Number(idStr);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: 'Invalid title id' });
    }

    const country = url.searchParams.get('country') || DEFAULT_COUNTRY;
    const language = url.searchParams.get('language') || DEFAULT_LANGUAGE;

    const Client: any = await getClient();
    const jw = new Client({ country, language });

    // Try common method names; adjust to the package’s actual API after testing
    let details: any;
    if (typeof jw.getTitle === 'function') {
      details = await jw.getTitle(id);
    } else if (typeof jw.title === 'function') {
      details = await jw.title(id);
    } else if (typeof jw.getTitleById === 'function') {
      details = await jw.getTitleById(id);
    } else {
      throw new Error('No supported title lookup method found on client');
    }

    res.setHeader('content-type', 'application/json; charset=utf-8');
    return res.status(200).send(JSON.stringify({ id, country, language, details }, null, 2));
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal error', detail: String(err?.message || err) });
  }
}
