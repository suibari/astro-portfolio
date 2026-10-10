const handle = 'suibari.com';

async function getJSON(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`AT Protocol request failed: ${response.status}`);
  return response.json();
}

export async function resolveNagiRepo() {
  const { did } = await getJSON(`https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`);
  const identityURL = did.startsWith('did:plc:')
    ? `https://plc.directory/${did}`
    : `https://${did.slice('did:web:'.length).split(':').map(decodeURIComponent).join('/')}${did.slice('did:web:'.length).includes(':') ? '/did.json' : '/.well-known/did.json'}`;
  const identity = await getJSON(identityURL);
  const pds = identity.service?.find((service: { id: string }) => service.id.endsWith('#atproto_pds'))?.serviceEndpoint;
  if (!pds) throw new Error('Personal Data Server not found');
  return { did: did as string, pds: pds as string };
}

export interface RepoRecord<T> { uri: string; value: T }
export async function listRecords<T>(repo: { did: string; pds: string }, collection: string, limit?: number): Promise<RepoRecord<T>[]> {
  const records: RepoRecord<T>[] = [];
  let cursor: string | undefined;
  do {
    const params = new URLSearchParams({ repo: repo.did, collection, limit: String(limit ?? 100) });
    if (cursor) params.set('cursor', cursor);
    const page = await getJSON(`${repo.pds}/xrpc/com.atproto.repo.listRecords?${params}`);
    records.push(...page.records);
    cursor = page.cursor;
  } while (!limit && cursor);
  return records;
}

export function blobURL(repo: { did: string; pds: string }, blob?: { ref?: { $link?: string } }) {
  const cid = blob?.ref?.$link;
  return cid ? `${repo.pds}/xrpc/com.atproto.sync.getBlob?${new URLSearchParams({ did: repo.did, cid })}` : '';
}
