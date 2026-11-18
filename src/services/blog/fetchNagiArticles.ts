import { resolveNagiRepo, listRecords, blobURL } from '../nagi/records';

interface Document {
  site: string;
  path?: string;
  title: string;
  publishedAt: string;
  coverImage?: { ref?: { $link?: string } };
}
interface Publication { url: string }

export async function fetchNagiArticles() {
  const repo = await resolveNagiRepo();
  const [documents, publications] = await Promise.all([
    listRecords<Document>(repo, 'site.standard.document'),
    listRecords<Publication>(repo, 'site.standard.publication'),
  ]);
  const sites = new Map(publications.map(record => [record.uri, record.value.url]));
  return documents.flatMap(record => {
    const document = record.value;
    const site = sites.get(document.site) ?? document.site;
    // 同じアカウントで他の公開アプリ（blento / mochott など）も standard.document を使うので、
    // Nagiのブログ（https://nagi.suibari.com/blog/<did>）に載っている記事だけを拾う
    if (!site.startsWith('https://nagi.suibari.com/')) return [];
    // スレッドを記事化したもの（/thread/...）はブログ記事ではないので除く
    if ((document.path ?? '').startsWith('/thread/')) return [];
    return [{
      title: document.title,
      link: `${site.replace(/\/+$/, '')}/${(document.path ?? '').replace(/^\/+/, '')}`,
      date: document.publishedAt,
      image: blobURL(repo, document.coverImage),
    }];
  }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
